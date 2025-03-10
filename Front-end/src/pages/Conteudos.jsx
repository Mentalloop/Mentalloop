import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Menu from '../components/Menu';
import Button from '../components/Button'; // Importe o componente Button
import '../styles/pages/dashboard.sass';
import '../styles/pages/conteudos.sass'; // Importar o arquivo de estilos

const Conteudos = () => {
  const { empresaNome } = useContext(AuthContext);
  const [conteudos, setConteudos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar conteúdos do Strapi com suas categorias relacionadas
        const resConteudos = await fetch('http://localhost:1337/api/conteudos?populate=*');
        const dataConteudos = await resConteudos.json();
        console.log('Conteúdos:', dataConteudos);

        setConteudos(dataConteudos.data || []); // Verificar se data existe

        // Extrair categorias únicas dos conteúdos
        const categoriasExtraidas = dataConteudos.data.flatMap(conteudo => conteudo.categorias.map(categoria => categoria.nome_categoria));
        const categoriasUnicas = Array.from(new Set(categoriasExtraidas));
        setCategorias(categoriasUnicas);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleFiltrarCategoria = (categoria) => {
    setFiltroCategoria(categoria);
  };

  const conteudosFiltrados = filtroCategoria
    ? conteudos.filter(conteudo =>
        conteudo.categorias.some(cat => cat.nome_categoria === filtroCategoria)
      )
    : conteudos;

  return (
    <div id="dashboard">
      <Menu />
      <div className="main-dashboard">
        <div className="dashboard-content">
          <h3>Conteúdos</h3>
          <div className="categorias-filtro">
            <Button variant={filtroCategoria === '' ? 'fill' : 'text'} onClick={() => handleFiltrarCategoria('')}>Todos</Button>
            {categorias.map((categoria, index) => (
              <Button
                key={index}
                variant={filtroCategoria === categoria ? 'fill' : 'text'}
                onClick={() => handleFiltrarCategoria(categoria)}
              >
                {categoria}
              </Button>
            ))}
          </div>
          <div className="conteudos-list">
            {conteudosFiltrados.map((conteudo) => (
              <div key={conteudo.id} className="conteudo-item">
                {conteudo.capa?.url ? (
                <img src={`http://localhost:1337${conteudo.capa.url}`} alt={conteudo.name || "Nome não disponível"} className='capa-img' />
                ) : (
                <p>Sem imagem</p>
                )}
                <div className='info-conteudo'>
                <h4>{conteudo.titulo}</h4>
                <p>{conteudo.descricao}</p>
                <div className="categorias">
                  {conteudo.categorias.map(cat => (
                    <span key={cat.id} className="categoria">{cat.nome_categoria}</span>
                  ))}
                </div>
                <Link to={`/conteudo/${conteudo.id}`}>Ler mais</Link> {/* Link para a página de conteúdo completo */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conteudos;
