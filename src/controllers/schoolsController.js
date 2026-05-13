const pool = require('../config/db');

exports.addSchool = async (req, res) => {
    try {
        const { name, address, latitude, longitude, established_year } = req.body;
        
        if (!name || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const [result] = await pool.execute(
            'INSERT INTO schools (name, address, latitude, longitude, established_year) VALUES (?, ?, ?, ?, ?)',
            [name, address, latitude, longitude, established_year || null]
        );

        res.status(201).json({ id: result.insertId, message: 'School added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.listSchools = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        const [rows] = await pool.execute('SELECT * FROM schools WHERE status = "active"');

        const schoolsWithDistance = rows.map(school => {
            const distance = Math.sqrt(
                Math.pow(school.latitude - lat, 2) + Math.pow(school.longitude - lon, 2)
            );
            return { ...school, distance };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(schoolsWithDistance);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllSchools = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM schools');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateSchoolStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const [result] = await pool.execute(
            'UPDATE schools SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'School not found' });
        }

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};