const pool = require('../models/database');


module.exports.addClinicalData = async (req, res) => {
    try {
        let clinical_data;
        let { patient_id, orgId, timestamp, from_healthkit_sync } = req.body;

        if (req.file) {
            const filePath = req.file.path;
            const fileContents = fs.readFileSync(filePath, 'utf8');
            clinical_data = JSON.parse(fileContents);

            fs.unlinkSync(filePath);

            patient_id = clinical_data.patient_id || patient_id;
            orgId = clinical_data.orgId || orgId;
            timestamp = clinical_data.timestamp || timestamp;
            from_healthkit_sync = clinical_data.from_healthkit_sync || from_healthkit_sync;
        } else if (req.body.clinical_data) {
            clinical_data = req.body.clinical_data;
        } else {
            return res.status(400).json({ error: 'No clinical data provided in body or file' });
        }

        if (!clinical_data || !patient_id || !orgId) {
            return res.status(400).json({ error: 'Invalid data provided' });
        }

        await pool.query(`
            INSERT INTO patients (patient_id, org_id, height, from_healthkit_sync, timestamp)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (patient_id) DO NOTHING
        `, [patient_id, orgId, clinical_data.HEIGHT?.data?.[0]?.measurement || null, from_healthkit_sync, timestamp]);

        async function insertClinicalData(tableName, clinicalData, columns, patientId) {
            if (clinicalData && clinicalData.data && Array.isArray(clinicalData.data)) {
                for (const entry of clinicalData.data) {
                    // Build the placeholders dynamically based on the number of columns
                    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

                    // Prepare the values array dynamically
                    const values = [
                        patientId,
                        entry.on_date,
                        entry.measurement,
                        clinicalData.uom
                    ];

                    try {
                        await pool.query(
                            `INSERT INTO ${tableName} (${columns.join(', ')})
                             VALUES (${placeholders})`,
                            values
                        );
                    } catch (error) {
                        console.error(`Error inserting data for patientId ${patientId}:`, error);
                        throw error;
                    }
                }
            }
        }

        if (clinical_data.HEART_RATE?.data) {
            await insertClinicalData('heart_rate', clinical_data.HEART_RATE, ['patient_id', 'on_date', 'measurement', 'uom'], patient_id);
        }

        if (clinical_data.WEIGHT?.data) {
            await insertClinicalData('weight', clinical_data.WEIGHT, ['patient_id', 'on_date', 'measurement', 'uom'], patient_id);
        }

        if (clinical_data.BLOOD_GLUCOSE_LEVELS?.data) {
            await insertClinicalData('blood_glucose', clinical_data.BLOOD_GLUCOSE_LEVELS, ['patient_id', 'on_date', 'measurement', 'uom'], patient_id);
        }

        if (clinical_data.BP?.data) {
            await insertClinicalData('blood_pressure', clinical_data.BP, ['patient_id', 'on_date', 'measurement', 'uom'], patient_id);
        }

        if (clinical_data.STEPS?.data) {
            await insertClinicalData('steps', clinical_data.STEPS, ['patient_id', 'on_date', 'measurement', 'uom'], patient_id);
        }

        res.status(201).json({ message: 'Clinical data inserted successfully' });
    } catch (error) {
        console.error('Error inserting clinical data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getClinicalDataRange = async (req, res) => {
    try {
        const { from_date, to_date, patient_id } = req.body;

        if (!from_date || !to_date || !patient_id) {
            return res.status(400).json({ error: 'Invalid data provided' });
        }

        if (new Date(from_date) >= new Date(to_date)) {
            return res.status(400).json({ error: 'from_date must be earlier than to_date.' });
        }

        const clinicalFields = [
            { name: 'Heart Rate', table: 'heart_rate', columns: ['measurement'] },
            { name: 'Weight', table: 'weight', columns: ['measurement'] },
            { name: 'Blood Glucose', table: 'blood_glucose', columns: ['measurement'] },
            { name: 'Blood Pressure', table: 'blood_pressure', columns: ['measurement'] },
            { name: 'Steps', table: 'steps', columns: ['measurement'] }
        ];

        const results = {};
        for (const field of clinicalFields) {
            const { name, table, columns } = field;
            const query = `
                SELECT MIN(${columns[0]}), MAX(${columns[0]})
                FROM ${table}
                WHERE patient_id = $1 AND on_date BETWEEN $2 AND $3
            `;
            const response = await pool.query(query, [patient_id, from_date, to_date]);

            if (response.rows.length > 0) {
                const minValue = response.rows[0].min;
                const maxValue = response.rows[0].max;

                if (minValue !== null && maxValue !== null) {
                    results[name] = { min: minValue, max: maxValue };
                }
            }
        }

        if (Object.keys(results).length > 0) {
            res.status(200).json({ data: results });
        } else {
            res.status(404).json({ message: 'No data found for the given date range' });
        }
    } catch (error) {
        console.error('Error fetching clinical data range:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};