'use client'

import { useEffect, useState } from "react";

export default function Home() {
  const [filmes, setFilmes] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [ano, setAno] = useState("");
  const [lancamento, setLancamento] = useState("");
  const [genero, setGenero] = useState("");
  const [diretor, setDiretor] = useState("");
  const [editandoId, setEditandoId] = useState(null); // Para identificar se está editando

  const fetchFilmes = async () => {
    try {
      const response = await fetch('/api/filmes');
      const data = await response.json();
      setFilmes(data);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    }
  };

  useEffect(() => {
    fetchFilmes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dadosFilme = { titulo, ano, lancamento, genero, diretor };

    try {
      const method = editandoId ? 'PUT' : 'POST';
      const url = editandoId ? `/api/filmes` : `/api/filmes`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editandoId ? { id: editandoId, ...dadosFilme } : dadosFilme),
      });

      if (response.ok) {
        console.log('Filme cadastrado/atualizado com sucesso');
        fetchFilmes(); // Atualiza a lista de filmes
        resetForm(); // Reseta o formulário
      } else {
        const errorData = await response.json();
        console.error('Erro ao cadastrar/atualizar filme:', errorData);
      }
    } catch (error) {
      console.error('Erro ao conectar a API:', error);
    }
  };

  const handleEdit = (filme) => {

    const lancamentoDate = new Date(filme.lancamento);//converte em um Date

    setTitulo(filme.titulo);
    setAno(filme.ano);
    setLancamento(lancamentoDate.toISOString().slice(0, 10));
    setGenero(filme.genero);
    setDiretor(filme.diretor);
    setEditandoId(filme.id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/filmes`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        console.log('Filme excluído com sucesso');
        fetchFilmes(); // Atualiza a lista após exclusão
      } else {
        console.error('Erro ao excluir filme');
      }
    } catch (error) {
      console.error('Erro ao conectar a API:', error);
    }
  };

  //limpa o form
  const resetForm = () => {
    setTitulo("");
    setAno("");
    setLancamento("");
    setGenero("");
    setDiretor("");
    setEditandoId(null);
  };

  return (
    <div>
      <h1>Cadastro de Filme</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="titulo">Título</label>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <label htmlFor="lancamento">Lançamento</label>
        <input
          type="date"
          id="lancamento"
          value={lancamento}
          onChange={(e) => setLancamento(e.target.value)}
        />
        <label htmlFor="ano">Ano</label>
        <input
          type="number"
          id="ano"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />
        <label htmlFor="genero">Gênero</label>
        <select
          id="genero"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        >
          <option value="">Selecione um gênero</option>
          <option value="acao">Ação</option>
          <option value="comedia">Comédia</option>
          <option value="drama">Drama</option>
          <option value="terror">Terror</option>
          <option value="suspense">Suspense</option>
        </select>
        <label htmlFor="diretor">Diretor:</label>
        <input
          type="text"
          id="diretor"
          value={diretor}
          onChange={(e) => setDiretor(e.target.value)}
        />
        <button type="submit">{editandoId ? 'Atualizar filme' : 'Cadastrar filme'}</button>
        <button type="button" onClick={resetForm}>Cancelar</button>
      </form>

      <table className="filme-tabela">
        <thead>
          <tr>
            <th>Título</th>
            <th>Ano</th>
            <th>Lançamento</th>
            <th>Gênero</th>
            <th>Diretor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filmes.map(filme => (
            <tr key={filme.id}>
              <td>{filme.titulo}</td>
              <td>{filme.ano}</td>
              <td>{new Date(filme.lancamento).toISOString().slice(0, 10)}</td>
              <td>{filme.genero}</td>
              <td>{filme.diretor}</td>
              <td>
                <button onClick={() => handleEdit(filme)}>Editar</button>
                <button onClick={() => handleDelete(filme.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
