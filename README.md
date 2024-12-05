# CareMonitor Clinical API

## Project Description

The CareMonitor Clinical API is a Node.js-based service designed to manage and analyze clinical data. The application provides two main functionalities:

1. **Submit Clinical Data**: A POST API that allows users to submit clinical data either as a JSON payload or by uploading a file.
2. **Retrieve Clinical Data**: A GET API that retrieves the minimum and maximum values of clinical fields (e.g., heart rate, steps, blood pressure) for a specified client ID and within a given date range.

This project uses PostgreSQL for data storage, and the database setup can be completed using the provided `.sql` file.

---

## Features

- Submit clinical data for various fields such as heart rate, steps, blood pressure, etc.
- Retrieve minimum and maximum values of clinical fields for analysis.
- Simple APIs for data submission and retrieval.
- PostgreSQL database integration for robust data management.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node.js** (v16 or later)
2. **PostgreSQL** (v12 or later)
3. **Nodemon** (for development, optional)

---

## Setup Instructions


### 1. Clone the Repository

```bash
git clone https://github.com/Shubham-Thakur06/clinical-api.git
cd caremonitor-clinical-api
```

### Step 2: Install Dependencies
Run the following command in the project directory to install the required dependencies:

```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory and configure the following environment variables:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=caremonitor_clinical_data
DB_PORT=5432
```

Replace `your_db_username` and `your_db_password` with your PostgreSQL credentials.

### Step 4: Setup the Database
1. Start your PostgreSQL server.
2. Use the provided `db_setup.sql` file to create the database and required tables. Run the following command:

```bash
psql -U your_db_username -d postgres -f path/to/db_setup.sql
```

Replace `your_db_username` with your PostgreSQL username and `path/to/db_setup.sql` with the path to the SQL file.

### Step 5: Start the Server
Run the following command to start the application:

- For production:
  ```bash
  npm start
  ```
- For development with live reload:
  ```bash
  npm run dev
  ```

The server will be accessible at `http://localhost:3000`.

---

## API Endpoints

### 1. **Submit Clinical Data**
- **Method**: `POST`
- **URL**: `/api/clinical-data`
- **Payload**: Clinical data as JSON or file upload.
- **Example JSON Payload**:

  ```json
  {
    "clinical_data": {
        "HEART_RATE": {
            "uom": "beats/min",
            "data": [
                {
                    "on_date": "2020-10-06T06:48:17.503000Z",
                    "measurement": "111"
                },
                {
                    "on_date": "2020-10-06T06:48:38.065000Z",
                    "measurement": "66"
                }
            ],
            "name": "Heart Rate"
        },
        "WEIGHT": {
            "uom": "Kg",
            "data": [
                {
                    "on_date": "2020-10-06T06:48:17.503000Z",
                    "measurement": "50"
                },
                {
                    "on_date": "2020-10-06T07:18:38.060000Z",
                    "measurement": "51"
                }
            ],
            "name": "Weight"
        },
        "BLOOD_GLUCOSE_LEVELS": {
            "uom": "mmol/L",
            "data": [
                {
                    "on_date": "2020-10-06T13:48:17.503000Z",
                    "measurement": "50"
                },
                {
                    "on_date": "2020-10-06T13:18:38.060000Z",
                    "measurement": "51"
                }
            ],
            "name": "Blood Glucose"
        },
        "HEIGHT": {
            "uom": "cm",
            "data": [
                {
                    "on_date": "2020-10-06T06:48:17.503000Z",
                    "measurement": "150"
                }
            ],
            "name": "Height"
        },
        "BP": {
            "uom": "mmHg",
            "data": [
                {
                    "on_date": "2020-10-06T06:48:17.503000Z",
                    "measurement": "50"
                },
                {
                    "on_date": "2020-10-06T07:18:38.060000Z",
                    "measurement": "51"
                }
            ],
            "name": "Blood Pressure"
        },
        "STEPS": {
            "uom": "",
            "data": [
                {
                    "on_date": "2020-10-05T13:00:00.000000Z",
                    "measurement": "11031"
                },
                {
                    "on_date": "2020-10-06T13:00:00.000000Z",
                    "measurement": "4667"
                }
            ],
            "name": "Steps"
        }
    },
    "patient_id": "gk6dhgh-9a60-4980-bb8b",
    "from_healthkit_sync": true,
    "orgId": "8gj4djk6s-a5ad-444b-b58c-358dcbd72dc3",
    "timestamp": "2020-10-09T05:36:31.381Z"
  }
  ```

### 2. **Retrieve Min and Max Values**
- **Method**: `GET`
- **URL**: `/api/clinical-data`
- **Example JSON Payload**:

  ```json
  {
    "patient_id": "patient_id",
    "from_date": "from_date",
    "to_date": "to_date",
  }
  ```

- **Response**:

  ```json
  {
    "data": {
        "Heart Rate": {
            "min": 66,
            "max": 167
        }
    }
  }
  ```

---

## Folder Structure

```
project/
├── src/
│   ├── app.js                              # Main application file
│   ├── routes/                             # API routes
│   ├── config/                             # App config
│   ├── models/                             # database models
│   └── controllers/                        # API controllers
├── scripts/
│   └── generate_clinical_data.js           # Script to create dummy data
├── caremonitor_clinical_data_setup.sql     # SQL file for database setup
├── package.json                            # Project dependencies
├── .env                                    # Environment variables
└── README.md                               # Documentation
```

---

## Dependencies

The project uses the following dependencies:

- **express**: Web framework for Node.js.
- **body-parser**: Middleware for parsing incoming request bodies.
- **dotenv**: Loads environment variables from a `.env` file.
- **multer**: Middleware for handling file uploads.
- **pg**: PostgreSQL client for Node.js.

---