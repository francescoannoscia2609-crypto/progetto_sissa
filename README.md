# Blood Analysis Backend

Node.js backend for blood analysis system with MySQL database.

## Setup

1. **Install MySQL**: Make sure MySQL is installed and running on your system.

2. **Create Database**:
   ```sql
   CREATE DATABASE analisi_sanguigne;
   ```

3. **Import Database Schema**:
   - Use MySQL Workbench, phpMyAdmin, or command line to import `../database_completo.sql`
   - Or from command line:
   ```bash
   mysql -u root -p analisi_sanguigne < ../database_completo.sql
   ```

4. **Configure Environment**:
   - Update `.env` file with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=analisi_sanguigne
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3000
   ```

5. **Install dependencies**:
```bash
npm install
```

6. **Start the server**:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (requires auth)

### Biomarkers
- `GET /api/biomarkers` - Get all biomarkers

### Test Results
- `POST /api/test-results` - Submit test results (requires auth)
- `GET /api/test-results` - Get user's test results (requires auth)
- `GET /api/test-history` - Get user's test history with filters (requires auth)

## Database Schema

- `users` - User accounts
- `biomarkers` - Blood test biomarkers
- `references_ranges` - Reference ranges by sex and age
- `test_results` - User test results