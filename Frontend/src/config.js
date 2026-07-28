let API_BASE;

if (window.location.hostname === "172.16.1.9") {
    API_BASE = `${window.location.origin}/backend`;
} else {
    API_BASE = "http://localhost/Amkor_VehicleBooking_System_2026/Backend";
}

export { API_BASE };