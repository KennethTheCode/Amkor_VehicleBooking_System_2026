let API_BASE;

if (window.location.hostname === "192.168.5.192") {
    API_BASE = `${window.location.origin}/Amkor_VehicleBooking_System_2026/Backend`;
} else {
    API_BASE = "http://localhost/Amkor_VehicleBooking_System_2026/Backend";
}

export { API_BASE };