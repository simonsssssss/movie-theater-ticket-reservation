const express = require('express');
const cors = require('cors');
const os = require('os');
const pool = require('./db');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.post('/movies', async (req, res) => {
    const { screening_time } = req.body;
    try {
        if(!screening_time || !screening_time.trim()) {
            res.status(400).json({error: 'Invalid data provided'});
        }
        else {
            const allMovies = await pool.query(
                'SELECT * FROM movies\n' +
                'WHERE EXISTS (\n' +
                '   SELECT 1\n' +
                '   FROM unnest(movies.screening_time) AS ts\n' +
                '   WHERE ts::date = $1\n' +
                ');', [screening_time]);
            res.json(allMovies.rows);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/movie/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
        if (movie.rows.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/addTicketReservation', async (req, res) => {
    const { full_name, email, movie_title, screening_time, ticket_type, ticket_price, row_number_, seat_number, movie_theater_name, movie_theater_address, auditorium_number } = req.body;
    try {
        const newTicketReservation = await pool.query(
            'INSERT INTO ticket_reservations (full_name, email, movie_title, screening_time, ticket_type, ticket_price, row_number_, seat_number, movie_theater_name, movie_theater_address, auditorium_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            [full_name, email, movie_title, screening_time, ticket_type, ticket_price, row_number_, seat_number, movie_theater_name, movie_theater_address, auditorium_number]
        );
        res.status(201).json(newTicketReservation.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    const hostname = os.hostname();
    console.log(`Server is running. Port: ${port}. Host: ${hostname}.`);
});