const db = require('../config/db');

exports.addSchool = async (req, res) => {
    try {
        const { name, address, latitude, longitude, established_year } = req.body;
        
        if (!name || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let insertId;
        if (db.dbType === 'neon' || db.dbType === 'postgres') {
            const result = await db.execute(
                'INSERT INTO schools (name, address, latitude, longitude, established_year) VALUES (?, ?, ?, ?, ?) RETURNING id',
                [name, address, latitude, longitude, established_year || null]
            );
            insertId = result[0][0].id;
        } else {
            const [result] = await db.execute(
                'INSERT INTO schools (name, address, latitude, longitude, established_year) VALUES (?, ?, ?, ?, ?)',
                [name, address, latitude, longitude, established_year || null]
            );
            insertId = result.insertId;
        }

        res.status(201).json({ id: insertId, message: 'School added successfully' });
    } catch (error) {
        console.error('Error adding school:', error);
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

        const [rows] = await db.execute("SELECT * FROM schools WHERE status = 'active'");

        const schoolsWithDistance = rows.map(school => {
            const distance = Math.sqrt(
                Math.pow(school.latitude - lat, 2) + Math.pow(school.longitude - lon, 2)
            );
            return { ...school, distance };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(schoolsWithDistance);
    } catch (error) {
        console.error('Error listing schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllSchools = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM schools');
        res.json(rows);
    } catch (error) {
        console.error('Error getting all schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getSchoolById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM schools WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'School not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error by ID:', error);
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

        const [rows, result] = await db.execute(
            'UPDATE schools SET status = ? WHERE id = ?',
            [status, id]
        );

        // In node-postgres, rowCount is in result / MySQL is affectedRows
        const rowsAffected = (db.dbType === 'neon' || db.dbType === 'postgres') ? result.rowCount : result.affectedRows;

        if (rowsAffected === 0) {
            return res.status(404).json({ error: 'School not found' });
        }

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteSchool = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows, result] = await db.execute('DELETE FROM schools WHERE id = ?', [id]);
        
        const rowsAffected = (db.dbType === 'neon' || db.dbType === 'postgres') ? result.rowCount : result.affectedRows;

        if (rowsAffected === 0) {
            return res.status(404).json({ error: 'School not found' });
        }

        res.json({ message: 'School deleted successfully' });
    } catch (error) {
        console.error('Error deleting school:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};