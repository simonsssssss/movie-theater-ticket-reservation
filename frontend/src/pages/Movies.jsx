import '../styles/Movies.css';
import {useEffect, useState} from "react";
import Modal from '../components/Modal';

function Movies() {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalActive, setModalActive] = useState(false);
    const [dateIsSelected, setDateIsSelected] = useState(false);
    const [datePickerValue, setDatePickerValue] = useState(null);
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:4000/movies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ screening_time: datePickerValue }),
                });
                const data = await response.json();
                setMovies(data);
            } catch (error) {
                console.error('Error fetching movies');
            }
        };
        fetchMovies();
    }, [datePickerValue]);
    const date = new Date();
    const currentDate = date.toJSON();
    const currentDateWithoutTime = currentDate.split("T")[0];
    date.setMonth(date.getMonth() + 1);
    const maxPickerDate = date.toJSON().split("T")[0];
    const handleChange = (e) => {
        const newDate = e.target.value;
        if(!newDate || !newDate.trim()) {
            setDateIsSelected(false);
        }
        else {
            setDateIsSelected(true);
            setDatePickerValue(newDate);
        }
    };
    const openModal = () => {
        setModalActive(true);
        document.body.style.overflow = 'hidden';
    }
    const closeModal = () => {
        document.body.style.overflow = '';
        setModalActive(false);
    }
    const handleClickForSelectedMovie = (movieId) => {
        setSelectedMovie(movieId);
        openModal();
    }
    return (
        <div className="movie-showtimes">
            {
                dateIsSelected ? (
                    <h1 className="title is-2" id="movie-showtimes-h1">Showtimes For {datePickerValue}</h1>
                ) : (
                    <h1 className="title is-2" id="movie-showtimes-h1">Select Date To View Showtimes</h1>
                )
            }
            <div className="date-picker">
                <input type="date" className="title" id="date-picker" min={currentDateWithoutTime} max={maxPickerDate} onChange={handleChange}></input>
            </div>
            {
                dateIsSelected ? (
                    movies.length > 0 ? (
                        <div className="movies-list">
                            {
                                movies.map((movie, index) => (
                                    <div className="box" id="movies-list-item" key={index}>
                                        <div className="grid">
                                            <div className="cell" id="movies-list-item-image">
                                                <div className="movies-list-item-image-wrapper" onClick={() => handleClickForSelectedMovie(movie.id)}>
                                                    <img src={movie.movie_image_url} id="movies-list-item-image-img" alt="Movie Poster" />
                                                    <div className="movies-list-item-image-overlay">
                                                        <i className="fa-solid fa-circle-play" id="movies-list-item-image-overlay-i"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="cell">
                                                <span id="movies-list-item-title">{movie.title_}</span><br />
                                                {movie.genre + " "}
                                                | {movie.duration_in_minutes} min
                                                | {movie.format_}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="tag is-white" id="no-date-selected-info">No showtimes for selected date</div>
                    )
                ) : (
                    <div className="tag is-white" id="no-date-selected-info">No date selected</div>
                )
            }
            <Modal isActive={isModalActive} closeModal={closeModal}>
                <iframe
                    title="Movie Trailer"
                    width="897"
                    height="505"
                    src={Array.from(movies).find(movie => movie.id === selectedMovie)?.trailer_embed_url || ''}>
                </iframe>
            </Modal>
        </div>
    );
}

export default Movies;