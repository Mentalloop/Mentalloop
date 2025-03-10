import React, { useEffect, useState } from "react";
import "../styles/pages/organograma.sass";
import Menu from '../components/Menu';

const Organograma = () => {
  const [colaboradores, setColaboradores] = useState([]);
  console.log("Estado inicial de colaboradores:", colaboradores);

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado");
        }
        console.log("Token recuperado:", token);

        const response = await fetch("http://localhost:1337/api/colaboradores?populate=*", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Status da resposta:", response.status);
        if (!response.ok) {
          throw new Error("Erro ao buscar colaboradores");
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        if (data.colaboradores) {
          const colaboradoresUnicos = data.colaboradores.reduce((acc, item) => {
            if (!acc.some(existing => existing.id === item.id)) {
              const colaborador = {
                id: item.id,
                nome: item.nome,
                departamento: item.departamento || { cargo: "Sem cargo" },
                supervisor: item.supervisor
                  ? { id: item.supervisor.id, ...item.supervisor }
                  : null
              };
              console.log("Colaborador formatado:", colaborador);
              acc.push(colaborador);
            }
            return acc;
          }, []);
          setColaboradores(colaboradoresUnicos);
          console.log("Colaboradores formatados:", colaboradoresUnicos);
        }
      } catch (error) {
        console.error("Erro ao buscar colaboradores:", error);
      }
    };

    fetchColaboradores();
  }, []);

  const construirHierarquia = (colaboradores) => {
    const mapa = {};
    const raiz = [];

    colaboradores.forEach((colaborador) => {
      mapa[colaborador.id] = { ...colaborador, subordinados: [] };
    });

    colaboradores.forEach((colaborador) => {
      if (colaborador.supervisor) {
        mapa[colaborador.supervisor.id].subordinados.push(mapa[colaborador.id]);
      } else {
        raiz.push(mapa[colaborador.id]);
      }
    });

    return raiz;
  };

  const hierarquia = construirHierarquia(colaboradores);
  console.log("Hierarquia construída:", hierarquia);

  const renderizarColaboradores = (colaboradores) => {
    console.log("Renderizando colaboradores:", colaboradores);
    return (
      <ul>
        {colaboradores.map((colaborador) => (
          <li key={colaborador.id}>
            <a href="#">
              <strong>{colaborador.nome}</strong> - {colaborador.departamento?.cargo || "Sem cargo"}
            </a>
            {colaborador.subordinados.length > 0 && renderizarColaboradores(colaborador.subordinados)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div id="dashboard">
      <Menu />
      <div className="main-dashboard">
        <div className="dashboard-content">
          <div className="organograma-container">
            <h5>Organograma da Empresa</h5>
            <div className="tree">
              {hierarquia.length > 0 ? renderizarColaboradores(hierarquia) : <p>Carregando...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organograma;
