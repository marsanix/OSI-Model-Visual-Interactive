export const PROTOCOL_DATA = {
    "HTTP": {
        name: "Hypertext Transfer Protocol",
        description: {
            id: "Protokol standar untuk mentransfer dokumen web (seperti HTML) di internet. HTTP bekerja dengan model request-response antara klien (browser) dan server.",
            en: "Standard protocol for transferring web documents (like HTML) on the internet. HTTP works on a request-response model between client (browser) and server."
        },
        use_cases: {
            id: "Browsing website, API (REST/SOAP), download file sederhana.",
            en: "Website browsing, APIs (REST/SOAP), simple file downloads."
        },
        security: {
            risks: [
                { title: "Clear Text Transmission", desc: { id: "Data dikirim tanpa enkripsi, rentan terhadap penyadapan (Eavesdropping/Sniffing).", en: "Data sent unencrypted, vulnerable to eavesdropping/sniffing." } },
                { title: "Man-in-the-Middle (MitM)", desc: { id: "Penyerang dapat memotong dan memodifikasi data di tengah jalan.", en: "Attackers can intercept and modify data in transit." } },
                { title: "XSS & CSRF", desc: { id: "Serangan injeksi kode pada aplikasi web yang berjalan di atas HTTP.", en: "Code injection attacks on web applications running over HTTP." } }
            ],
            mitigation: [
                { title: "Gunakan HTTPS", desc: { id: "Wajib beralih ke HTTPS untuk mengenkripsi trafik menggunakan TLS/SSL.", en: "Must switch to HTTPS to encrypt traffic using TLS/SSL." } },
                { title: "HSTS", desc: { id: "HTTP Strict Transport Security memaksa browser hanya menggunakan koneksi aman.", en: "HTTP Strict Transport Security forces browsers to use only secure connections." } }
            ]
        },
        references: [
            { title: "MDN Web Docs - HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP" },
            { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" }
        ]
    },
    "HTTPS": {
        name: "Hypertext Transfer Protocol Secure",
        description: {
            id: "Versi aman dari HTTP yang menggunakan SSL/TLS untuk mengenkripsi komunikasi antara klien dan server.",
            en: "Secure version of HTTP that uses SSL/TLS to encrypt communication between client and server."
        },
        use_cases: {
            id: "E-commerce, Perbankan Online, Login Page, semua website modern.",
            en: "E-commerce, Online Banking, Login Pages, all modern websites."
        },
        security: {
            risks: [
                { title: "SSL Stripping", desc: { id: "Penyerang memaksa downgrade koneksi dari HTTPS ke HTTP.", en: "Attacker forces connection downgrade from HTTPS to HTTP." } },
                { title: "Expired/Fake Certificates", desc: { id: "Sertifikat yang tidak valid dapat menipu pengguna (Phishing).", en: "Invalid certificates can deceive users (Phishing)." } }
            ],
            mitigation: [
                { title: "Certificate Pinning", desc: { id: "Memastikan aplikasi hanya menerima sertifikat spesifik.", en: "Ensures the application only accepts specific certificates." } },
                { title: "TLS 1.3", desc: { id: "Gunakan versi TLS terbaru yang lebih aman dan cepat.", en: "Use the latest TLS version for better security and speed." } }
            ]
        },
        references: [
            { title: "Why HTTPS Matters - Google", url: "https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https" }
        ]
    },
    "FTP": {
        name: "File Transfer Protocol",
        description: {
            id: "Protokol standar untuk mengirimkan file komputer antar mesin dalam sebuah jaringan.",
            en: "Standard protocol for transmitting computer files between machines on a network."
        },
        use_cases: {
            id: "Upload file ke web hosting, sharing file di kantor lama.",
            en: "Uploading files to web hosting, file sharing in legacy office setups."
        },
        security: {
            risks: [
                { title: "No Encryption", desc: { id: "Username dan password dikirim dalam bentuk teks polos (Clear Text).", en: "Username and password sent in clear text." } },
                { title: "Brute Force", desc: { id: "Serangan menebak password secara terus menerus.", en: "Continuous password guessing attacks." } }
            ],
            mitigation: [
                { title: "Gunakan FTPS/SFTP", desc: { id: "SFTP (SSH File Transfer Protocol) jauh lebih aman karena terenkripsi penuh.", en: "SFTP is much safer due to full encryption." } },
                { title: "Disable Anonymous Login", desc: { id: "Jangan izinkan akses tanpa otentikasi.", en: "Do not allow access without authentication." } }
            ]
        },
        references: []
    },
    "SSH": {
        name: "Secure Shell",
        description: {
            id: "Protokol jaringan kriptografi untuk mengoperasikan layanan jaringan secara aman di atas jaringan yang tidak aman.",
            en: "Cryptographic network protocol for operating network services securely over an unsecured network."
        },
        use_cases: {
            id: "Remote login ke server, manajemen sistem jarak jauh, SFTP.",
            en: "Remote server login, remote system management, SFTP."
        },
        security: {
            risks: [
                { title: "Brute Force Attacks", desc: { id: "Sangat sering menjadi target bot untuk menebak password root.", en: "Frequent target for bots guessing root passwords." } },
                { title: "Key Leakage", desc: { id: "Jika Private Key bocor, penyerang memiliki akses penuh.", en: "If Private Key leaks, attackers have full access." } }
            ],
            mitigation: [
                { title: "Disable Root Login", desc: { id: "Jangan izinkan login langsung sebagai root.", en: "Do not allow direct root login." } },
                { title: "Key-Based Auth", desc: { id: "Gunakan SSH Key pairs dan matikan otentikasi password.", en: "Use SSH Key pairs and disable password authentication." } },
                { title: "Fail2Ban", desc: { id: "Blokir IP yang gagal login berkali-kali.", en: "Block IPs with multiple failed login attempts." } }
            ]
        },
        references: []
    },
    "DNS": {
        name: "Domain Name System",
        description: {
            id: "Sistem penamaan hierarkis yang menerjemahkan nama domain (google.com) menjadi alamat IP (142.250.x.x).",
            en: "Hierarchical naming system translating domain names (google.com) to IP addresses."
        },
        use_cases: {
            id: "Resolusi nama website, Email routing (MX Records).",
            en: "Website name resolution, Email routing (MX Records)."
        },
        security: {
            risks: [
                { title: "DNS Spoofing/Poisoning", desc: { id: "Memasukkan data palsu ke cache DNS resolver untuk mengalihkan trafik ke situs jahat.", en: "Injecting fake data into DNS resolver cache to redirect traffic to malicious sites." } },
                { title: "DNS Amplification DDoS", desc: { id: "Menggunakan server DNS terbuka untuk membanjiri target dengan trafik besar.", en: "Using open DNS servers to flood targets with massive traffic." } }
            ],
            mitigation: [
                { title: "DNSSEC", desc: { id: "Menambahkan tanda tangan digital kriptografi ke rekaman DNS.", en: "Adds cryptographic digital signatures to DNS records." } },
                { title: "Limit Recursion", desc: { id: "Konfigurasi server DNS untuk hanya melayani klien yang terpercaya.", en: "Configure DNS server to only serve trusted clients." } }
            ]
        },
        references: [
            { title: "What is DNS? - Cloudflare", url: "https://www.cloudflare.com/learning/dns/what-is-dns/" }
        ]
    },
    "TCP": {
        name: "Transmission Control Protocol",
        description: {
            id: "Protokol inti internet yang menjamin pengiriman data yang andal, berurutan, dan bebas error antarakomputer.",
            en: "Core internet protocol ensuring reliable, ordered, and error-free data delivery between computers."
        },
        use_cases: {
            id: "Website (HTTP), Email (SMTP), Transfer File (FTP).",
            en: "Websites (HTTP), Email (SMTP), File Transfer (FTP)."
        },
        security: {
            risks: [
                { title: "SYN Flood Attack", desc: { id: "Mengirimkan banyak permintaan koneksi (SYN) tanpa menyelesaikannya (ACK) untuk menghabiskan resource server.", en: "Sending many connection requests (SYN) without completing them (ACK) to exhaust server resources." } },
                { title: "TCP Reset Attack", desc: { id: "Memutuskan koneksi yang sedang berjalan dengan memalsukan paket RST.", en: "Terminating active connections by forging RST packets." } }
            ],
            mitigation: [
                { title: "SYN Cookies", desc: { id: "Mekanisme pertahanan server untuk mencegah alokasi memori pada permintaan SYN palsu.", en: "Server defense mechanism to prevent memory allocation for fake SYN requests." } },
                { title: "Firewall Filtering", desc: { id: "Memfilter paket TCP yang tidak wajar.", en: "Filter abnormal TCP packets." } }
            ]
        },
        references: []
    },
    "UDP": {
        name: "User Datagram Protocol",
        description: {
            id: "Protokol komunikasi connectionless yang mengutamakan kecepatan daripada keandalan. Tidak menjamin paket sampai atau berurutan.",
            en: "Connectionless communication protocol prioritizing speed over reliability. No guarantee of delivery or order."
        },
        use_cases: {
            id: "Streaming Video, Game Online, DNS, VoIP.",
            en: "Video Streaming, Online Gaming, DNS, VoIP."
        },
        security: {
            risks: [
                { title: "UDP Flood", desc: { id: "Serangan DDoS dengan membanjiri port random pada target dengan paket UDP.", en: "DDoS attack flooding random ports on target with UDP packets." } },
                { title: "Amplification Attacks", desc: { id: "Memanfaatkan layanan UDP (NTP, DNS) untuk memantulkan trafik besar ke korban.", en: "Exploiting UDP services (NTP, DNS) to reflect massive traffic to victims." } }
            ],
            mitigation: [
                { title: "Rate Limiting", desc: { id: "Membatasi jumlah paket UDP yang diterima per detik.", en: "Limit the number of UDP packets received per second." } },
                { title: "DDoS Protection", desc: { id: "Menggunakan layanan mitigasi DDoS (seperti Cloudflare/Akamai).", en: "Use DDoS mitigation services (like Cloudflare/Akamai)." } }
            ]
        },
        references: []
    },
    "IP": {
        name: "Internet Protocol",
        description: {
            id: "Protokol utama Network Layer yang bertanggung jawab untuk pengalamatan (Addressing) dan routing paket data.",
            en: "Principal Network Layer protocol responsible for addressing and routing data packets."
        },
        use_cases: {
            id: "Dasar dari seluruh komunikasi Internet (IPv4/IPv6).",
            en: "Foundation of all Internet communication (IPv4/IPv6)."
        },
        security: {
            risks: [
                { title: "IP Spoofing", desc: { id: "Memalsukan alamat IP pengirim untuk menyembunyikan identitas atau melakukan serangan DDoS.", en: "Forging sender IP address to hide identity or conduct DDoS attacks." } },
                { title: "Man-in-the-Middle", desc: { id: "Tanpa enkripsi, paket IP mudah dibaca di tengah jalan.", en: "Without encryption, IP packets are easily read in transit." } }
            ],
            mitigation: [
                { title: "IPsec", desc: { id: "Suite protokol untuk mengamankan komunikasi IP dengan autentikasi dan enkripsi paket.", en: "Protocol suite to secure IP communication with authentication and encryption." } },
                { title: "Ingress Filtering", desc: { id: "Memfilter paket dengan source IP yang tidak valid di router tepi.", en: "Filter packets with invalid source IPs at edge routers." } }
            ]
        },
        references: []
    },
    "SSL": { name: "Secure Sockets Layer", description: { id: "Protokol keamanan usang (pendahulu TLS).", en: "Obsolete security protocol (predecessor to TLS)." }, use_cases: { id: "Legacy systems.", en: "Legacy systems." }, security: { risks: [{ title: "POODLE Attack", desc: { id: "Vulnerability fatal pada SSLv3.", en: "Fatal vulnerability in SSLv3." } }], mitigation: [{ title: "Disable SSL", desc: { id: "Gunakan TLS 1.2 atau 1.3 saja.", en: "Use TLS 1.2 or 1.3 only." } }] }, references: [] },
    "TLS": { name: "Transport Layer Security", description: { id: "Penerus SSL yang lebih aman.", en: "More secure successor to SSL." }, use_cases: { id: "HTTPS, SMTPS, VPN.", en: "HTTPS, SMTPS, VPN." }, security: { risks: [], mitigation: [] }, references: [] },
    "SMTP": { name: "Simple Mail Transfer Protocol", description: { id: "Standar pengiriman email.", en: "Standard for email transmission." }, use_cases: { id: "Kirim Email.", en: "Sending Email." }, security: { risks: [{ title: "Spam/Phishing", desc: { id: "Mudah dipalsukan pengirimnya.", en: "Sender easily spoofed." } }], mitigation: [{ title: "SPF, DKIM, DMARC", desc: { id: "Mekanisme verifikasi pengirim email.", en: "Email sender verification mechanisms." } }] }, references: [] },
    "Ethernet": { name: "Ethernet", description: { id: "Teknologi standard untuk LAN kabel.", en: "Standard technology for wired LANs." }, security: { risks: [{ title: "ARP Spoofing", desc: { id: "Menipu mapping IP-to-MAC di jaringan lokal.", en: "Deceiving IP-to-MAC mapping in local network." } }], mitigation: [{ title: "Dynamic ARP Inspection", desc: { id: "Fitur pada switch untuk memvalidasi paket ARP.", en: "Switch feature to validate ARP packets." } }] }, references: [] },
    "VLAN": { name: "Virtual LAN", description: { id: "Membagi satu jaringan fisik menjadi beberapa jaringan logis.", en: "Splits one physical network into multiple logical networks." }, security: { risks: [{ title: "VLAN Hopping", desc: { id: "Penyerang melompat ke VLAN lain yang seharusnya terisolasi.", en: "Attacker hops to another VLAN that should be isolated." } }], mitigation: [{ title: "Disable DTP", desc: { id: "Matikan Dynamic Trunking Protocol pada port akses.", en: "Disable Dynamic Trunking Protocol on access ports." } }] }, references: [] },

    "ICMP": { name: "Internet Control Message Protocol", description: { id: "Protokol untuk diagnosa dan laporan error (misal: Ping, Traceroute).", en: "Protocol for diagnostics and error reporting (e.g., Ping, Traceroute)." }, use_cases: { id: "Ping, Network unreachable errors.", en: "Ping, Network unreachable errors." }, security: { risks: [{ title: "ICMP Flood", desc: { id: "DDoS Ping of Death.", en: "DDoS Ping of Death." } }], mitigation: [{ title: "Disable ICMP", desc: { id: "Blokir ICMP di firewall jika tidak perlu.", en: "Block ICMP on firewall if unnecessary." } }] }, references: [] },
    "IGMP": { name: "Internet Group Management Protocol", description: { id: "Mengelola keanggotaan grup untuk IP Multicast.", en: "Manages group membership for IP Multicast." }, use_cases: { id: "IPTV, Streaming ke banyak klien.", en: "IPTV, Streaming to many clients." }, security: { risks: [], mitigation: [] }, references: [] },
    "ARP": { name: "Address Resolution Protocol", description: { id: "Menerjemahkan IP Address ke MAC Address.", en: "Resolves IP Addresses to MAC Addresses." }, use_cases: { id: "Komunikasi dalam LAN.", en: "LAN communication." }, security: { risks: [{ title: "ARP Poisoning", desc: { id: "Attacker memalsukan respon ARP agar trafik korban melalui mesin attacker.", en: "Attacker fake ARP responses to route victim traffic through attacker machine." } }], mitigation: [{ title: "Dynamic ARP Inspection", desc: { id: "Fitur switch untuk validasi ARP.", en: "Switch feature to validate ARP responses." } }] }, references: [] },
    "IPsec": { name: "Internet Protocol Security", description: { id: "Suite protokol untuk mengamankan komunikasi IP (VPN).", en: "Protocol suite for securing IP communication (VPN)." }, use_cases: { id: "Site-to-Site VPN, Remote Access VPN.", en: "Site-to-Site VPN, Remote Access VPN." }, security: { risks: [{ title: "Weak Crypto", desc: { id: "Menggunakan algoritma lama (DES/MD5).", en: "Using old algorithms (DES/MD5)." } }], mitigation: [{ title: "Gunakan AES/SHA-2", desc: { id: "Standar enkripsi modern.", en: "Modern encryption standards (AES/SHA-2)." } }] }, references: [] },
    "Wi-Fi": { name: "Wi-Fi (IEEE 802.11)", description: { id: "Teknologi jaringan nirkabel (Wireless LAN).", en: "Wireless LAN technology." }, use_cases: { id: "Koneksi internet tanpa kabel.", en: "Wireless internet connection." }, security: { risks: [{ title: "Deauth Attack", desc: { id: "Memutus koneksi klien secara paksa.", en: "Forcibly disconnecting clients." } }, { title: "Evil Twin", desc: { id: "Access Point palsu yang meniru SSID asli.", en: "Fake Access Point mimicking original SSID." } }], mitigation: [{ title: "WPA3", desc: { id: "Standar keamanan Wi-Fi terbaru.", en: "Latest Wi-Fi security standard." } }, { title: "VPN", desc: { id: " Gunakan VPN saat di Wi-Fi publik.", en: "Use VPN on public Wi-Fi." } }] }, references: [] },
    "PPP": { name: "Point-to-Point Protocol", description: { id: "Protokol layer 2 untuk komunikasi langsung antar dua node.", en: "Layer 2 protocol for direct communication between two nodes." }, use_cases: { id: "Koneksi dial-up, serial link.", en: "Dial-up connections, serial links." }, security: { risks: [], mitigation: [] }, references: [] },
    "NetBIOS": { name: "Network Basic Input/Output System", description: { id: "API jaringan legacy untuk Windows.", en: "Legacy network API for Windows." }, use_cases: { id: "File sharing (SMB) di jaringan lama.", en: "File sharing (SMB) on legacy networks." }, security: { risks: [{ title: "Enumeration", desc: { id: "Attacker bisa melihat daftar user/share.", en: "Attacker can enumerate users/shares." } }], mitigation: [{ title: "Disable NetBIOS", desc: { id: "Matikan jika tidak diperlukan (gunakan DNS).", en: "Disable if not needed (use DNS)." } }] }, references: [] },
    "RPC": { name: "Remote Procedure Call", description: { id: "Mengizinkan program menjalan kode di komputer lain.", en: "Allows programs to execute code on another computer." }, use_cases: { id: "Manajemen sistem remote.", en: "Remote system management." }, security: { risks: [{ title: "Buffer Overflow", desc: { id: "Sering jadi target exploit (misal: Conficker).", en: "Frequent exploit target (e.g., Conficker)." } }], mitigation: [{ title: "Firewall", desc: { id: "Batasi akses port RPC.", en: "Restrict RPC port access." } }] }, references: [] },
    "SQL": { name: "Structured Query Language", description: { id: "Bahasa standar untuk database relasional.", en: "Standard language for relational databases." }, use_cases: { id: "Menyimpan data aplikasi.", en: "Storing application data." }, security: { risks: [{ title: "SQL Injection", desc: { id: "Memasukkan kode SQL berbahaya lewat input user.", en: "Injecting malicious SQL code via user input." } }], mitigation: [{ title: "Prepared Statements", desc: { id: "Cara coding aman untuk mencegah injeksi.", en: "Secure coding to prevent injection." } }] }, references: [] },
    "ASCII": { name: "American Standard Code for Information Interchange", description: { id: "Standar encoding karakter teks.", en: "Character encoding standard for text." }, use_cases: { id: "File teks, protokol berbasis teks (HTTP/SMTP).", en: "Text files, text-based protocols (HTTP/SMTP)." }, security: { risks: [], mitigation: [] }, references: [] },
    "JPEG": { name: "JPEG Image", description: { id: "Format kompresi gambar lossy.", en: "Lossy image compression format." }, use_cases: { id: "Foto web.", en: "Web photos." }, security: { risks: [], mitigation: [] }, references: [] },
    "MPEG": { name: "MPEG Video", description: { id: "Standar coding audio/video.", en: "Audio/video coding standard." }, use_cases: { id: "Video streaming.", en: "Video streaming." }, security: { risks: [], mitigation: [] }, references: [] },
    "Cables": { name: "Network Cables", description: { id: "Media transmisi fisik (Twisted Pair, Coaxial).", en: "Physical transmission media (Twisted Pair, Coaxial)." }, use_cases: { id: "Ethernet (RJ45).", en: "Ethernet (RJ45)." }, security: { risks: [{ title: "Tapping", desc: { id: "Penyadapan fisik kabel.", en: "Physical cable tapping." } }], mitigation: [{ title: "Physical Security", desc: { id: "Amankan akses ke ruang server/kabel.", en: "Secure access to server rooms/cables." } }] }, references: [] },
    "Fiber": { name: "Fiber Optic", description: { id: "Kabel serat optik menggunakan cahaya.", en: "Optical fiber cable using light." }, use_cases: { id: "Backbone internet, kecepatan tinggi.", en: "Internet backbone, high speed." }, security: { risks: [{ title: "Physical Damage", desc: { id: "Kabel putus memutus jaringan.", en: "Severed cable disconnects network." } }], mitigation: [{ title: "Redundancy", desc: { id: "Jalur cadangan.", en: "Backup lines." } }] }, references: [] },
    "Hubs": { name: "Network Hub", description: { id: "Perangkat layer 1 yang meneruskan data ke SEMUA port (broadcast).", en: "Layer 1 device forwarding data to ALL ports (broadcast)." }, use_cases: { id: "Jaringan legacy (Jarang dipakai).", en: "Legacy networks (Rarely used)." }, security: { risks: [{ title: "Sniffing", desc: { id: "Mudah disadap karena semua data dikirim ke semua port.", en: "Easy scanning as data is sent to all ports." } }], mitigation: [{ title: "Gunakan Switch", desc: { id: "Switch lebih cerdas dan aman.", en: "Switches are smarter and safer." } }] }, references: [] },
    "Repeaters": { name: "Repeater", description: { id: "Memperkuat sinyal agar bisa menempuh jarak lebih jauh.", en: "Amplifies signal to travel longer distances." }, use_cases: { id: "Memperpanjang jangkauan Wi-Fi/Kabel.", en: "Extending Wi-Fi/Cable range." }, security: { risks: [], mitigation: [] }, references: [] },
    "Switching": { name: "Switching", description: { id: "Proses meneruskan paket berdasarkan MAC address (Layer 2) atau IP (Layer 3).", en: "Forwarding packets based on MAC address (Layer 2) or IP (Layer 3)." }, use_cases: { id: "LAN modern.", en: "Modern LANs." }, security: { risks: [], mitigation: [] }, references: [] }
};
