import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import '../styles/pages/conteudos.sass'; // Importe o arquivo de estilos

const ConteudoCompleto = () => {
  const { id } = useParams(); // Obtenha o ID do conteúdo da URL
  const navigate = useNavigate(); // Utilize o hook useNavigate para navegação
  const [conteudo, setConteudo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Estado para a barra de progresso
  const [currentTime, setCurrentTime] = useState(0); // Tempo atual do áudio
  const [duration, setDuration] = useState(0); // Duração total do áudio
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:1337/api/conteudos?populate=*');
        if (!res.ok) {
          throw new Error('Conteúdo não encontrado');
        }
        const data = await res.json();
        const conteudoEncontrado = data.data.find(c => c.id === parseInt(id));
        if (!conteudoEncontrado) {
          throw new Error('Conteúdo não encontrado');
        }
        setConteudo(conteudoEncontrado);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [id]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setCurrentTime(currentTime);
    setDuration(duration);
    setProgress((currentTime / duration) * 100);
  };

  const handleProgressBarClick = (e) => {
    const progressBar = e.target;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newTime = (clickPosition / progressBar.offsetWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!conteudo) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="main-conteudo">
        <div className="conteudo-completo">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft />
          </button>
          <div>
            <h3>{conteudo.titulo}</h3>
            <p>{conteudo.descricao}</p>
          </div>
          <button onClick={handlePlayPause} className="play-pause-button">
                {isPlaying ? <Pause /> : <Play />}
          </button>
          {conteudo.audio?.url ? (
            <div className="audio-container">
              <audio
                ref={audioRef}
                src={`http://localhost:1337${conteudo.audio.url}`}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
              />
              
              <div className="progress-bar" onClick={handleProgressBarClick}>
                <div
                  className="progress"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="time-info">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          ) : (
            <p>Sem áudio</p>
          )}
        </div>
      </div>
  );
};

export default ConteudoCompleto;
