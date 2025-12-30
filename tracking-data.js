/* ======================================================
   ON SHADE – GLOBAL TRACKING STORE
   Frontend Only • No Backend • No JSON • Stable
====================================================== */

(function () {
  const STORAGE_KEY = "onshade_shipments";

  /* ===============================
     LOAD / SAVE
  =============================== */
  function loadShipments() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveShipments(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /* ===============================
     TRACKING CODE GENERATOR
  =============================== */
  function generateCode(mode) {
    const prefix =
      mode === "Air" ? "OS-AIR" :
      mode === "Sea" ? "OS-SEA" :
      "OS-ROAD";

    const rand = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${rand}`;
  }

  /* ===============================
     DEFAULT STATUSES
  =============================== */
  function defaultStatuses(mode) {
    if (mode === "Air") {
      return [
        "Shipment Created",
        "Received at Warehouse",
        "Customs Clearance",
        "In Transit by Air",
        "Arrived at Destination Airport",
        "Out for Delivery"
      ];
    }

    if (mode === "Sea") {
      return [
        "Shipment Created",
        "Container Loaded",
        "Departed Port",
        "At Sea",
        "Arrived at Destination Port",
        "Awaiting Clearance"
      ];
    }

    return [
      "Shipment Created",
      "Loaded on Truck",
      "In Transit",
      "Reached City Hub",
      "Out for Delivery",
      "Delivered"
    ];
  }

  /* ===============================
     CREATE
  =============================== */
  function createShipment(name, mode) {
    const data = loadShipments();
    const code = generateCode(mode);

    data[code] = {
      customer: name,
      mode,
      statuses: defaultStatuses(mode),
      lastUpdated: new Date().toLocaleString()
    };

    saveShipments(data);
    return code;
  }

  /* ===============================
     UPDATE
  =============================== */
  function updateShipment(code, statuses) {
    const data = loadShipments();
    if (!data[code]) return false;

    data[code].statuses = statuses;
    data[code].lastUpdated = new Date().toLocaleString();
    saveShipments(data);
    return true;
  }

  /* ===============================
     DELETE
  =============================== */
  function deleteShipment(code) {
    const data = loadShipments();
    delete data[code];
    saveShipments(data);
  }

  /* ===============================
     PUBLIC API
  =============================== */
  window.TrackingStore = {
    loadShipments,
    createShipment,
    updateShipment,
    deleteShipment
  };
})();
