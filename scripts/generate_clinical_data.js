const fs = require('fs');

function generateDummyData() {
  const now = new Date();

  function generateTimestamps(intervalMinutes, count, startTime = new Date()) {
    const timestamps = [];
    for (let i = 0; i < count; i++) {
      timestamps.push(new Date(startTime - i * intervalMinutes * 60000).toISOString());
    }
    return timestamps.reverse();
  }

  function generateMeasurements(timestamps, min, max) {
    return timestamps.map((timestamp) => ({
      on_date: timestamp,
      measurement: (Math.random() * (max - min) + min).toFixed(0),
    }));
  }

  const data = {
    clinical_data: {
      HEART_RATE: {
        uom: "beats/min",
        data: generateMeasurements(generateTimestamps(1, 120), 60, 120),
        name: "Heart Rate",
      },
      WEIGHT: {
        uom: "Kg",
        data: generateMeasurements(generateTimestamps(1440, 5), 50, 60),
        name: "Weight",
      },
      BLOOD_GLUCOSE_LEVELS: {
        uom: "mmol/L",
        data: generateMeasurements(generateTimestamps(480, 15), 4, 8),
        name: "Blood Glucose",
      },
      HEIGHT: {
        uom: "cm",
        data: [
          {
            on_date: now.toISOString(),
            measurement: "170",
          },
        ],
        name: "Height",
      },
      BP: {
        uom: "mmHg",
        data: generateMeasurements(generateTimestamps(5, 144), 70, 120),
        name: "Blood Pressure",
      },
      STEPS: {
        uom: "",
        data: generateMeasurements(generateTimestamps(1440, 5), 4000, 12000),
        name: "Steps",
      },
    },
    patient_id: "gk6dhgh-9a60-4980-bb8b",
    from_healthkit_sync: true,
    orgId: "8gj4djk6s-a5ad-444b-b58c-358dcbd72dc3",
    timestamp: now.toISOString(),
  };

  fs.writeFileSync('dummy_data.json', JSON.stringify(data, null, 2));
}

generateDummyData();