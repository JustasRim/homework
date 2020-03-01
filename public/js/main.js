const MovieList = (props) => (
    <datalist id='movies'> 
        {props.movies.map(movie => <Item title={movie.original_title} {...movie}/>)}
    </datalist>
);

class Item extends React.Component {
    render() {
        const movie = this.props;
        return (
            <option value={movie.title}>rating {movie.vote_average}, {movie.release_date.substring(0, 4)}</option>
        );
    }
}

class Input extends React.Component {
    state = { movie: '' };
    
    debounce(func, wait, immediate) {
        var timeout;
      
        return function executedFunction() {
          var context = this;
          var args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
    
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
    };

    returnedFunction =  this.debounce(async () => {
        if (this.state.movie.length < 3) return;
        const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=5cc15e4a40e3dc5c8659b64522722028&language=en-US&query=${this.state.movie}`);
        const data = await resp.json();
        this.setState({ movie: '' });
        this.props.onSubmit(data);
    }, 250);

    componentDidMount() {
        this.input.addEventListener('input', this.returnedFunction);
    }

    render() {
        return (
            <div>
                <i class="fas fa-film"></i>
                <input
                    ref={elem => this.input = elem}
                    onChange={event => this.setState({movie: event.target.value})}
                    placeholder="Enter movie title"
                    list="movies"
                />
                <a href="#" class="btn"><i class="fas fa fa-search"></i></a>
            </div>
        );
    }
}

class Form extends React.Component {
    state = { movies: [], }
    movieHandler = (data) => {
        this.setState({movies:  data.results});
    }

    render()
    {
        return (
            <div>
                <Input onSubmit={this.movieHandler} />
                <MovieList movies={this.state.movies.slice(0, 8)} />
            </div>
        )
    }   
}

ReactDOM.render(
    <Form />,
    header,
);
