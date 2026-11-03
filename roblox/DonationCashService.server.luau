--[[
    ===================================================================
    AW STUDIO DONATION CASH - SERVER SCRIPT (ROBLOX STUDIO)
    File: ServerScriptService/DonationCashService.server.luau
    Author: AW Studio Developer Hub
    Description:
        Mengambil antrean donasi dari webhook Saweria, SociaBuzz, & BagiBagi
        lalu mengkreditkan Cash secara real-time ke player dan menyimpan
        ke DataStoreService.
    ===================================================================
]]--

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- KONFIGURASI SERVER
local CONFIG = {
    -- PENTING: Gunakan server lokal milik Anda atau URL deploy sendiri.
    -- JANGAN PERNAH mengarahkan ke website eksternal milik orang lain.
    API_URL = "http://localhost:3000",
    UNIVERSE_ID = "YOUR_UNIVERSE_ID",
    SECRET_KEY = "aw_sec_local_vault99",
    POLL_INTERVAL_SECONDS = 15, -- Waktu jeda polling ke server lokal
    DATASTORE_NAME = "DonationCash_V1",
}

local CashDataStore = DataStoreService:GetDataStore(CONFIG.DATASTORE_NAME)

-- Inisialisasi leaderstats untuk setiap player yang bergabung
Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local cash = Instance.new("IntValue")
    cash.Name = "Cash"
    cash.Value = 0
    cash.Parent = leaderstats

    -- Load saldo dari DataStore
    local key = "Player_" .. player.UserId
    local success, savedBalance = pcall(function()
        return CashDataStore:GetAsync(key)
    end)

    if success and savedBalance then
        cash.Value = savedBalance
        print("[DonationCash]: Loaded " .. savedBalance .. " Cash untuk " .. player.Name)
    else
        cash.Value = 0
    end
end)

-- Simpan saldo saat player keluar
Players.PlayerRemoving:Connect(function(player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if leaderstats then
        local cash = leaderstats:FindFirstChild("Cash")
        if cash then
            local key = "Player_" .. player.UserId
            pcall(function()
                CashDataStore:SetAsync(key, cash.Value)
            end)
        end
    end
end)

-- Fungsi untuk mengkreditkan Cash ke player online
local function CreditPlayerCash(username, cashAmount, donatorName, message)
    local targetPlayer = Players:FindFirstChild(username)
    if targetPlayer then
        local leaderstats = targetPlayer:FindFirstChild("leaderstats")
        if leaderstats then
            local cash = leaderstats:FindFirstChild("Cash")
            if cash then
                cash.Value += cashAmount

                -- Simpan ke DataStore
                local key = "Player_" .. targetPlayer.UserId
                pcall(function()
                    CashDataStore:SetAsync(key, cash.Value)
                end)

                -- Broadcast notifikasi ke seluruh server
                local announcement = string.format(
                    "[DONASI]: Terima kasih %s mendonasikan Cash sebesar %d kepada @%s! Pesan: '%s'",
                    donatorName, cashAmount, username, message
                )
                print("[DonationCash Notification]: " .. announcement)
                
                -- Kirim RemoteEvent ke Client jika ada GUI alert
                local alertRemote = ReplicatedStorage:FindFirstChild("DonationAlertEvent")
                if alertRemote and alertRemote:IsA("RemoteEvent") then
                    alertRemote:FireAllClients({
                        Donator = donatorName,
                        Recipient = username,
                        CashAmount = cashAmount,
                        Message = message
                    })
                end
            end
        end
    end
end

-- Polling loop untuk mengecek donasi yang belum di-klaim
task.spawn(function()
    while true do
        task.wait(CONFIG.POLL_INTERVAL_SECONDS)
        
        -- Dapatkan daftar username pemain yang sedang online
        local onlinePlayers = {}
        for _, player in ipairs(Players:GetPlayers()) do
            table.insert(onlinePlayers, player.Name)
        end

        if #onlinePlayers > 0 then
            for _, playerName in ipairs(onlinePlayers) do
                pcall(function()
                    local url = CONFIG.API_URL .. "/api/roblox/claim"
                    local payload = HttpService:JSONEncode({
                        universeId = CONFIG.UNIVERSE_ID,
                        robloxUsername = playerName
                    })

                    local response = HttpService:PostAsync(url, payload, Enum.HttpContentType.ApplicationJson, false, {
                        ["Authorization"] = "Bearer " .. CONFIG.SECRET_KEY
                    })

                    local data = HttpService:JSONDecode(response)
                    if data and data.success and data.donations then
                        for _, don in ipairs(data.donations) do
                            CreditPlayerCash(playerName, don.cashReward, don.donator, don.message or "")
                        end
                    end
                end)
            end
        end
    end
end)

print("[AW Studio]: Server script siap menerima donasi dari Saweria, SociaBuzz, dan BagiBagi!")

