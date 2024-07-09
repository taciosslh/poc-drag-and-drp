import { useState } from "react";
import "./App.scss";

function App() {
  const [rotas, setRotas] = useState([
    {
      id: 1,
      nome: "Rota 1",
      filiais: [
        { nome: "Filial 140", cubagem: 10 },
        { nome: "Filial 240", cubagem: 20 },
      ],
      totalCubagem: 30,
    },
    {
      id: 2,
      nome: "Rota 2",
      filiais: [{ nome: "Filial 145", cubagem: 15 }],
      totalCubagem: 15,
    },
    {
      id: 3,
      nome: "Rota 3",
      filiais: [
        { nome: "Filial 142", cubagem: 12 },
        { nome: "Filial 242", cubagem: 22 },
        { nome: "Filial 342", cubagem: 32 },
      ],
      totalCubagem: 66,
    },
    {
      id: 4,
      nome: "Rota 4",
      filiais: [
        { nome: "Filial 148", cubagem: 18 },
        { nome: "Filial 248", cubagem: 28 },
        { nome: "Filial 348", cubagem: 38 },
      ],
      totalCubagem: 84,
    },
    {
      id: 5,
      nome: "Rota 5",
      filiais: [
        { nome: "Filial 240", cubagem: 20 },
        { nome: "Filial 340", cubagem: 30 },
        { nome: "Filial 440", cubagem: 40 },
      ],
      totalCubagem: 90,
    },
    {
      id: 6,
      nome: "Rota 6",
      filiais: [
        { nome: "Filial 144", cubagem: 14 },
        { nome: "Filial 244", cubagem: 24 },
        { nome: "Filial 344", cubagem: 34 },
      ],
      totalCubagem: 72,
    },
  ]);

  return (
    <div className="container mt-5">
      <table className="table cubagem-table">
        <thead>
          <tr>
            <th>Nome da Rota</th>
            <th>Filial 1</th>
            <th>Filial 2</th>
            <th>Filial 3</th>
            <th>Total de Cubagem</th>
          </tr>
        </thead>
        <tbody>
          {rotas.map((rota, rotaIndex) => (
            <tr key={"rota_" + rota.id}>
              <td>{rota.nome}</td>
              {Array.from({ length: 3 }).map((_, i) => (
                <td
                  key={`rota_${rota.id}_filial_${i}`}
                  onDrop={(e) => handleDrop(e, { rotaIndex, filialIndex: i })}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {rota.filiais[i]?.cubagem && (
                    <span
                      draggable={true}
                      onDragStart={(e) =>
                        handleDragStart(e, {
                          filial: rota.filiais[i],
                          source: { rotaIndex, filialIndex: i },
                        })
                      }
                    >
                      {rota.filiais[i].nome}
                      <br />
                      <small className="text-muted">
                        {rota.filiais[i]?.cubagem}
                      </small>
                    </span>
                  )}
                </td>
              ))}
              <td>{rota.totalCubagem}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function handleDragStart(event, data) {
    event.dataTransfer.setData("application/json", JSON.stringify(data));
  }

  function handleDrop(event, dest) {
    event.preventDefault();
    const updatedRotas = [...rotas];

    const { filial, source } = JSON.parse(
      event.dataTransfer.getData("application/json")
    );

    const rotaSrc = rotas[source.rotaIndex];
    const rotaDest = rotas[dest.rotaIndex];

    if (rotaDest.filiais.length >= 3 && dest.rotaIndex !== source.rotaIndex) {
      alert("Rota cheia");
      return;
    }

    rotaSrc.filiais[source.filialIndex] = null;
    rotaSrc.totalCubagem = calcTotalCubagem(rotaSrc.filiais)

    rotaDest.filiais.splice(
      dest.filialIndex + 1 === rotaDest.filiais.length
        ? dest.filialIndex + 1
        : dest.filialIndex,
      0,
      filial
    );
    rotaDest.totalCubagem = calcTotalCubagem(rotaDest.filiais)

    rotaSrc.filiais = rotaSrc.filiais.filter((f) => f !== null);

    updatedRotas[source.rotaIndex] = rotaSrc;
    updatedRotas[dest.rotaIndex] = rotaDest;

    setRotas(updatedRotas);
  }

  function calcTotalCubagem(filiais) {
    return filiais
      .filter((f) => f !== null)
      .reduce((acc, val) => acc + (val.cubagem || 0), 0);
  }
}

export default App;
