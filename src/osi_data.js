export const OSI_LAYERS = [
  {
    id: 7,
    name: "Application",
    pdu: "Data",
    subtitle: {
      id: "Proses Jaringan ke Aplikasi",
      en: "Network Process to Application"
    },
    description: {
      id: "Layer ini menyediakan antarmuka bagi aplikasi pengguna untuk mengakses layanan jaringan. Ini adalah layer yang paling dekat dengan pengguna.",
      en: "This layer provides the interface for user applications to access network services. It is the layer closest to the user."
    },
    details: {
      id: "Layer 7 bertanggung jawab atas identifikasi mitra komunikasi, penentuan ketersediaan sumber daya, dan sinkronisasi komunikasi.",
      en: "Layer 7 is responsible for identifying communication partners, determining resource availability, and synchronizing communication."
    },
    protocols: ["HTTP", "HTTPS", "FTP", "SMTP", "DNS", "SSH"],
    color: "#FF6B6B",
    icon: "🖥️",
    ports: [
      { number: 80, service: "HTTP", desc: "Web Traffic (Unsecured)" },
      { number: 443, service: "HTTPS", desc: "Web Traffic (Secured)" },
      { number: 53, service: "DNS", desc: "Domain Name System" },
      { number: 22, service: "SSH", desc: "Secure Shell" }
    ],
    references: [
      { title: "OSI Application Layer - GeeksforGeeks", url: "https://www.geeksforgeeks.org/application-layer-in-osi-model/" },
      { title: "What is the Application Layer? - Cloudflare", url: "https://www.cloudflare.com/learning/ddos/glossary/osi-model/" },
      { title: "Hypertext Transfer Protocol (HTTP) - MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP" }
    ]
  },
  {
    id: 6,
    name: "Presentation",
    pdu: "Data",
    subtitle: {
      id: "Representasi & Enkripsi Data",
      en: "Data Representation & Encryption"
    },
    description: {
      id: "Bertanggung jawab untuk memastikan data dapat dibaca oleh sistem penerima. Melakukan translate, enkripsi, dan kompresi data.",
      en: "Responsible for ensuring data is readable by the receiving system. Handles translation, encryption, and compression."
    },
    details: {
      id: "Layer ini menerjemahkan data antara format aplikasi dan jaringan. Contohnya konversi ASCII ke EBCDIC, atau enkripsi SSL/TLS.",
      en: "This layer translates data between application and network formats. Examples include ASCII to EBCDIC conversion, or SSL/TLS encryption."
    },
    protocols: ["SSL", "TLS", "JPEG", "MPEG", "ASCII"],
    color: "#4ECDC4",
    icon: "🔐",
    ports: [],
    references: [
      { title: "Presentation Layer in OSI Model", url: "https://www.geeksforgeeks.org/presentation-layer-in-osi-model/" },
      { title: "Transport Layer Security (TLS) - Wikipedia", url: "https://en.wikipedia.org/wiki/Transport_Layer_Security" }
    ]
  },
  {
    id: 5,
    name: "Session",
    pdu: "Data",
    subtitle: {
      id: "Komunikasi Antar Host",
      en: "Interhost Communication"
    },
    description: {
      id: "Mengelola, memelihara, dan menghentikan sesi komunikasi antar aplikasi.",
      en: "Manages, maintains, and terminates communication sessions between applications."
    },
    details: {
      id: "Layer ini mengontrol dialog antar komputer. Ia menetapkan, mengelola, dan memutuskan koneksi antara aplikasi lokal dan remote.",
      en: "This layer controls dialogues between computers. It establishes, manages, and terminates connections between local and remote applications."
    },
    protocols: ["NetBIOS", "RPC", "SQL"],
    color: "#45B7D1",
    icon: "🤝",
    ports: [],
    references: [
      { title: "Session Layer in OSI Model", url: "https://www.geeksforgeeks.org/session-layer-in-osi-model/" },
      { title: "Remote Procedure Call (RPC)", url: "https://en.wikipedia.org/wiki/Remote_procedure_call" }
    ]
  },
  {
    id: 4,
    name: "Transport",
    pdu: "Segments",
    subtitle: {
      id: "Koneksi End-to-End",
      en: "End-to-End Connections"
    },
    description: {
      id: "Menyediakan transfer data yang transparan antara end system, bertanggung jawab untuk error recovery dan flow control.",
      en: "Provides transparent data transfer between end systems, responsible for error recovery and flow control."
    },
    details: {
      id: "Layer ini memecah data menjadi segmen. Protokol utamanya adalah TCP (reliable) dan UDP (unreliable/cepat).",
      en: "This layer breaks data into segments. Main protocols are TCP (reliable) and UDP (unreliable/fast)."
    },
    protocols: ["TCP", "UDP"],
    color: "#96CEB4",
    icon: "🚚",
    ports: [
      { number: "TCP", service: "Connection Oriented", desc: "Reliable, ordered delivery" },
      { number: "UDP", service: "Connectionless", desc: "Unreliable, fast delivery (Streaming/Gaming)" }
    ],
    references: [
      { title: "Transport Layer in OSI Model", url: "https://www.geeksforgeeks.org/transport-layer-in-osi-model/" },
      { title: "TCP vs UDP (GeeksforGeeks)", url: "https://www.geeksforgeeks.org/differences-between-tcp-and-udp/" },
      { title: "Transmission Control Protocol - Wikipedia", url: "https://en.wikipedia.org/wiki/Transmission_Control_Protocol" }
    ]
  },
  {
    id: 3,
    name: "Network",
    pdu: "Packets",
    subtitle: {
      id: "Penentuan Jalur & Pengalamatan Logis",
      en: "Path Determination & Logical Addressing"
    },
    description: {
      id: "Menentukan jalur terbaik untuk memindahkan data dari satu jaringan ke jaringan lain (Routing).",
      en: "Determines the best path to move data from one network to another (Routing)."
    },
    details: {
      id: "Layer ini menggunakan alamat logis (IP Address) untuk merutekan paket data melewati jaringan yang berbeda.",
      en: "This layer uses logical addressing (IP Addresses) to route data packets across different networks."
    },
    protocols: ["IP", "ICMP", "IGMP", "IPsec"],
    color: "#FFEEAD",
    icon: "🌐",
    ports: [],
    references: [
      { title: "Network Layer in OSI Model", url: "https://www.geeksforgeeks.org/network-layer-in-osi-model/" },
      { title: "Internet Protocol (IP) - Wikipedia", url: "https://en.wikipedia.org/wiki/Internet_Protocol" },
      { title: "What is Routing? - Cloudflare", url: "https://www.cloudflare.com/learning/network-layer/what-is-routing/" }
    ]
  },
  {
    id: 2,
    name: "Data Link",
    pdu: "Frames",
    subtitle: {
      id: "Pengalamatan Fisik",
      en: "Physical Addressing"
    },
    description: {
      id: "Menyediakan transfer data node-to-node (hop-to-hop) dan menangani error pada physical layer.",
      en: "Provides node-to-node (hop-to-hop) data transfer and handles errors in the physical layer."
    },
    details: {
      id: "Layer ini bekerja dengan frame dan MAC Address. Terdiri dari sub-layer LLC (Logical Link Control) dan MAC (Media Access Control).",
      en: "This layer works with frames and MAC Addresses. Consists of LLC (Logical Link Control) and MAC (Media Access Control) sub-layers."
    },
    protocols: ["Ethernet", "PPP", "Switching", "VLAN"],
    color: "#D4A5A5",
    icon: "🔗",
    ports: [],
    references: [
      { title: "Data Link Layer in OSI Model", url: "https://www.geeksforgeeks.org/data-link-layer-in-osi-model/" },
      { title: "What is a MAC Address?", url: "https://www.geeksforgeeks.org/mac-address-in-computer-network/" }
    ]
  },
  {
    id: 1,
    name: "Physical",
    pdu: "Bits",
    subtitle: {
      id: "Media, Sinyal, & Transmisi Biner",
      en: "Media, Signal, & Binary Transmission"
    },
    description: {
      id: "Transmisi bit stream mentah melalui media fisik.",
      en: "Transmission of raw bit streams over physical media."
    },
    details: {
      id: "Berurusan dengan kabel, tegangan listik, pin, repeater, dan hub. Mengubah bit menjadi sinyal listrik, cahaya, atau radio.",
      en: "Deals with cables, voltages, pins, repeaters, and hubs. Converts bits into electrical, light, or radio signals."
    },
    protocols: ["Cables", "Hubs", "Repeaters", "Fiber"],
    color: "#9B59B6",
    icon: "🔌",
    ports: [],
    references: [
      { title: "Physical Layer in OSI Model", url: "https://www.geeksforgeeks.org/physical-layer-in-osi-model/" },
      { title: "Introduction to Networking Cable", url: "https://en.wikipedia.org/wiki/Networking_cables" }
    ]
  }
];

export const TCP_IP_LAYERS = [
  {
    id: 4,
    name: "Application",
    pdu: "Data",
    description: {
      id: "Menggabungkan fungsi OSI Application, Presentation, dan Session.",
      en: "Combines OSI Application, Presentation, and Session functions."
    },
    subtitle: {
      id: "Komunikasi Proses-ke-Proses",
      en: "Process-to-Process Communication"
    },
    details: {
      id: "Dalam model TCP/IP, layer ini menangani protokol tingkat tinggi, representasi data, dan kontrol sesi sekaligus. Ini adalah antarmuka utama bagi data pengguna.",
      en: "In the TCP/IP model, this layer handles high-level protocols, data representation, and session control simultaneously. It is the main interface for user data."
    },
    protocols: ["HTTP", "DNS", "SSH", "FTP"],
    color: "#FF6B6B",
    icon: "🖥️",
    ports: [],
    references: [],
    osi_mapping: [7, 6, 5],
    height_factor: 3
  },
  {
    id: 3,
    name: "Transport",
    pdu: "Segments",
    description: {
      id: "Sama dengan OSI Transport Layer.",
      en: "Same as the OSI Transport Layer."
    },
    subtitle: {
      id: "Komunikasi Host-ke-Host",
      en: "Host-to-Host Communication"
    },
    details: {
      id: "Menyediakan layanan pengiriman data yang andal (TCP) atau cepat (UDP) antar aplikasi di host yang berbeda. Mengatur flow control dan error checking.",
      en: "Provides reliable (TCP) or fast (UDP) data delivery services between applications on different hosts. Manages flow control and error checking."
    },
    protocols: ["TCP", "UDP"],
    color: "#96CEB4",
    icon: "🚚",
    ports: [],
    references: [],
    osi_mapping: [4],
    height_factor: 1
  },
  {
    id: 2,
    name: "Internet",
    pdu: "Packets",
    description: {
      id: "Setara dengan OSI Network Layer.",
      en: "Equivalent to the OSI Network Layer."
    },
    subtitle: {
      id: "Internetworking & Routing",
      en: "Internetworking & Routing"
    },
    details: {
      id: "Bertanggung jawab untuk merutekan paket data ke tujuan yang benar melintasi berbagai jaringan (Internetwork). Menggunakan IP Address.",
      en: "Responsible for routing data packets to the correct destination across various networks (Internetwork). Uses IP Addresses."
    },
    protocols: ["IP", "ICMP", "ARP"],
    color: "#FFEEAD",
    icon: "🌐",
    ports: [],
    references: [],
    osi_mapping: [3],
    height_factor: 1
  },
  {
    id: 1,
    name: "Network Access",
    pdu: "Frames & Bits",
    description: {
      id: "Menggabungkan fungsi OSI Data Link dan Physical Layer.",
      en: "Combines OSI Data Link and Physical Layer functions."
    },
    subtitle: {
      id: "Pengalamatan Fisik & Transmisi",
      en: "Physical Addressing & Transmission"
    },
    details: {
      id: "Layer ini tidak hanya menangani pengalamatan fisik (MAC) dan framing, tetapi juga mendefinisikan karakteristik media transmisi, sinyal, dan encoding biner. Ini adalah jembatan antara perangkat lunak jaringan dan perangkat keras fisik.",
      en: "This layer not only handles physical addressing (MAC) and framing but also defines transmission media characteristics, signals, and binary encoding. It's the bridge between network software and physical hardware."
    },
    protocols: ["Ethernet", "Wi-Fi", "Fiber", "PPP"],
    color: "#D4A5A5",
    icon: "🔌🔗",
    ports: [],
    references: [
      { title: "TCP/IP Network Access Layer", url: "https://www.geeksforgeeks.org/tcp-ip-model/" },
      { title: "Ethernet Protocol", url: "https://en.wikipedia.org/wiki/Ethernet" }
    ],
    osi_mapping: [2, 1],
    height_factor: 2
  }
];
