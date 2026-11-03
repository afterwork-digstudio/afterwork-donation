--[[
    ===================================================================
    AW STUDIO DONATION CASH - SERVER SCRIPT (ROBLOX STUDIO)
    File: ServerScriptService/DonationCashService.server.luau
    Author: AW Studio Developer Hub
    Documentation: https://afterwork-donation.vercel.app
    
    CARA PASANG DI ROBLOX STUDIO:
    1. Buka Game Settings > Security > Aktifkan "Allow HTTP Requests" & "Enable Studio Access to API Services".
    2. Masukkan script ini ke dalam: Explorer > ServerScriptService > Script (Beri nama 'DonationCashService').
    3. Pastikan CONFIG.API_URL mengarah ke domain Vercel Anda.
    ===================================================================
]]--

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TextChatService = game:GetService("TextChatService")

-- ===================================================================
-- 1. KONFIGURASI SISTEM
-- ===================================================================
local CONFIG = {
    -- URL Backend Dashboard Anda di Vercel:
    API_URL = "https://afterwork-donation.vercel.app",

    -- Universe ID Game Roblox Anda (dapat dilihat di dashboard Vercel / Creator Hub):
    UNIVERSE_ID = "10765129159",

    -- Kunci otorisasi pengaman (disamakan dengan token master):
    SECRET_KEY = "aw_sec_local_vault99",

    -- Interval pengecekan antrean donasi baru (Detik):
    -- 15 detik sangat ideal dan ramah batas kuota 500 req/menit HttpService Roblox
    POLL_INTERVAL_SECONDS = 15,

    -- Nama DataStore untuk menyimpan saldo cash permanen player:
    DATASTORE_NAME = "DonationCash_V1",

    -- Nama value di leaderstats pemain (Contoh: "Cash" atau "Coins"):
    LEADERSTATS_CURRENCY_NAME = "Cash",
}

local CashDataStore = DataStoreService:GetDataStore(CONFIG.DATASTORE_NAME)

-- Pastikan RemoteEvent untuk GUI client tersedia otomatis di ReplicatedStorage
local alertRemote = ReplicatedStorage:FindFirstChild("DonationAlertEvent")
if not alertRemote then
    alertRemote = Instance.new("RemoteEvent")
    alertRemote.Name = "DonationAlertEvent"
    alertRemote.Parent = ReplicatedStorage
end

-- ===================================================================
-- 2. LEADERSTATS & DATASTORE LIFECYCLE
-- ===================================================================
Players.PlayerAdded:Connect(function(player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then
        leaderstats = Instance.new("Folder")
        leaderstats.Name = "leaderstats"
        leaderstats.Parent = player
    end

    local cash = leaderstats:FindFirstChild(CONFIG.LEADERSTATS_CURRENCY_NAME)
    if not cash then
        cash = Instance.new("IntValue")
        cash.Name = CONFIG.LEADERSTATS_CURRENCY_NAME
        cash.Value = 0
        cash.Parent = leaderstats
    end

    -- Muat saldo terakhir player dari DataStore
    local key = "Player_" .. player.UserId
    local success, savedBalance = pcall(function()
        return CashDataStore:GetAsync(key)
    end)

    if success and savedBalance then
        cash.Value = savedBalance
        print(string.format("[AW Studio]: Berhasil memuat %d %s untuk @%s", savedBalance, CONFIG.LEADERSTATS_CURRENCY_NAME, player.Name))
    else
        cash.Value = 0
    end
end)

Players.PlayerRemoving:Connect(function(player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if leaderstats then
        local cash = leaderstats:FindFirstChild(CONFIG.LEADERSTATS_CURRENCY_NAME)
        if cash then
            local key = "Player_" .. player.UserId
            pcall(function()
                CashDataStore:SetAsync(key, cash.Value)
            end)
        end
    end
end)

-- ===================================================================
-- 3. BROADCAST NOTIFIKASI DALAM GAME
-- ===================================================================
local function BroadcastAnnouncement(donatorName, targetUsername, cashAmount, message)
    local formattedMsg = string.format("🎉 TERIMA KASIH! %s mendonasikan %d Cash kepada @%s! \"%s\"", donatorName, cashAmount, targetUsername, message)

    -- 1. Cetak ke Server Console
    print("[AW Studio Donation Alert]: " .. formattedMsg)

    -- 2. Tampilkan di Roblox Modern TextChatService (Jika aktif)
    pcall(function()
        local textChannels = TextChatService:FindFirstChild("TextChannels")
        if textChannels then
            local generalChannel = textChannels:FindFirstChild("RBXGeneral")
            if generalChannel and generalChannel:IsA("TextChannel") then
                generalChannel:DisplaySystemMessage("<font color='#F59E0B'><b>[DONASI MASUK]</b></font> " .. formattedMsg)
            end
        end
    end)

    -- 3. Kirim sinyal RemoteEvent ke seluruh layar player (Untuk pop-up alert GUI & Sound)
    if alertRemote and alertRemote:IsA("RemoteEvent") then
        alertRemote:FireAllClients({
            Donator = donatorName,
            Recipient = targetUsername,
            CashAmount = cashAmount,
            Message = message,
            Timestamp = os.time(),
        })
    end
end

-- ===================================================================
-- 4. KREDIT CASH KE TARGET PEMAIN
-- ===================================================================
local function CreditPlayerCash(username, cashAmount, donatorName, message)
    local targetPlayer = Players:FindFirstChild(username)
    if not targetPlayer then
        -- Jika player belum online atau beda server, cari case-insensitive
        for _, p in ipairs(Players:GetPlayers()) do
            if string.lower(p.Name) == string.lower(username) then
                targetPlayer = p
                break
            end
        end
    end

    if targetPlayer then
        local leaderstats = targetPlayer:FindFirstChild("leaderstats")
        if leaderstats then
            local cash = leaderstats:FindFirstChild(CONFIG.LEADERSTATS_CURRENCY_NAME)
            if cash then
                cash.Value += cashAmount

                -- Simpan segera ke DataStore
                local key = "Player_" .. targetPlayer.UserId
                pcall(function()
                    CashDataStore:SetAsync(key, cash.Value)
                end)

                -- Tampilkan siaran notifikasi
                BroadcastAnnouncement(donatorName, targetPlayer.Name, cashAmount, message or "")
            end
        end
    end
end

-- ===================================================================
-- 5. BATCH POLLING DAEMON KE BACKEND (HEMAT KUOTA HTTP)
-- ===================================================================
task.spawn(function()
    print("[AW Studio]: DonationCashService aktif. Menghubungkan ke: " .. CONFIG.API_URL)

    while true do
        task.wait(CONFIG.POLL_INTERVAL_SECONDS)

        -- Kumpulkan seluruh username player yang sedang online di server ini
        local onlinePlayers = {}
        for _, player in ipairs(Players:GetPlayers()) do
            table.insert(onlinePlayers, player.Name)
        end

        -- Lakukan pengecekan batch hanya jika ada pemain di dalam server
        if #onlinePlayers > 0 then
            local claimSuccess, claimError = pcall(function()
                local url = CONFIG.API_URL .. "/api/roblox/claim"
                local requestBody = HttpService:JSONEncode({
                    universeId = CONFIG.UNIVERSE_ID,
                    usernames = onlinePlayers, -- Batching 1 request untuk seluruh player
                })

                local response = HttpService:PostAsync(
                    url,
                    requestBody,
                    Enum.HttpContentType.ApplicationJson,
                    false,
                    {
                        ["Authorization"] = "Bearer " .. CONFIG.SECRET_KEY,
                    }
                )

                local data = HttpService:JSONDecode(response)
                if data and data.success and data.donations and #data.donations > 0 then
                    print(string.format("[AW Studio]: Menemukan %d donasi baru dari webhook!", #data.donations))
                    for _, donation in ipairs(data.donations) do
                        CreditPlayerCash(
                            donation.robloxUsername,
                            donation.cashReward,
                            donation.donator,
                            donation.message or ""
                        )
                    end
                end
            end)

            if not claimSuccess then
                warn("[AW Studio Warning]: Gagal menghubungi API server (" .. tostring(claimError) .. "). Periksa Allow HTTP Requests di Game Settings.")
            end
        end
    end
end)
