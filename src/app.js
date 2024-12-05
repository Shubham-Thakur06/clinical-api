const express = require('express');
const bodyParser = require('body-parser');
const clinicalDataRoutes = require('./routes/clinicalDataRoutes');

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use('/api/clinical-data', clinicalDataRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
