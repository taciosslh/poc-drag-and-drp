import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import "./App.scss";

function transformToFiliaisObject(rota) {
  console.log({rota})
  const result = {
    ...rota,
    filial1: rota.filiais[0] || {},
    filial2: rota.filiais[1] || {},
    filial3: rota.filiais[2] || {},
  };
  delete result.filiais;
  return result;
}

function transformToFiliaisArray(rota) {
  return {
    ...rota,
    filiais: [rota.filial1, rota.filial2, rota.filial3]
      .filter((f) => f)
      .filter((f) => Object.keys(f).length),
  };
}

function App() {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "nome",
      headerName: "Nome da rota",
      width: 150,
      editable: true,
    },
    ...[1, 2, 3].map((i) => ({
      field: "filial" + i,
      headerName: "Filial " + i,
      width: 80,
      // editable: true,
      renderCell: (params) => {
        console.log({ params }, i);

        return (
          <div
            onDrop={(e) =>
              handleDrop(e, {
                rotaIndex: rotas.findIndex((r) => r.id === params.id),
                filialIndex: i,
              })
            }
            onDragOver={(e) => e.preventDefault()}
          >
            {params.row["filial" + i] && (
              <span
                draggable={true}
                onDragStart={(e) =>
                  handleDragStart(e, {
                    filial: params.row["filial" + i],
                    source: {
                      rotaIndex: rotas.findIndex((r) => r.id === params.id),
                      filialIndex: i,
                    },
                  })
                }
              >
                {params.row["filial" + i].nome}
                <br />
                <small className="text-muted">
                  {params.row["filial" + i].cubagem}
                </small>
              </span>
            )}
          </div>
        );
      },
    })),
    {
      field: "totalCubagem",
      headerName: "Cubagem total",
      width: 150,
      editable: true,
    },
  ];
  const [rotas, setRotas] = useState([
    {
      id: 1,
      nome: "Rota 1",
      filial1: { nome: "Filial 140", cubagem: 10 },
      filial2: { nome: "Filial 240", cubagem: 20 },
      filial3: {},
      totalCubagem: 30,
    },
    {
      id: 2,
      nome: "Rota 2",
      filial1: { nome: "Filial 145", cubagem: 15 },
      filial2: {},
      filial3: {},
      totalCubagem: 15,
    },
    {
      id: 3,
      nome: "Rota 3",
      filial1: { nome: "Filial 142", cubagem: 12 },
      filial2: { nome: "Filial 242", cubagem: 22 },
      filial3: { nome: "Filial 342", cubagem: 32 },
      totalCubagem: 66,
    },
    {
      id: 4,
      nome: "Rota 4",
      filial1: { nome: "Filial 148", cubagem: 18 },
      filial2: { nome: "Filial 248", cubagem: 28 },
      filial3: { nome: "Filial 348", cubagem: 38 },
      totalCubagem: 84,
    },
    {
      id: 5,
      nome: "Rota 5",
      filial1: { nome: "Filial 240", cubagem: 20 },
      filial2: { nome: "Filial 340", cubagem: 30 },
      filial3: { nome: "Filial 440", cubagem: 40 },
      totalCubagem: 90,
    },
    {
      id: 7,
      nome: "Rota 6",
      filial1: { nome: "Filial 144", cubagem: 14 },
      filial2: { nome: "Filial 244", cubagem: 24 },
      filial3: { nome: "Filial 344", cubagem: 34 },
      totalCubagem: 72,
    },
  ]);
  console.log({ rotas });

  return <DataGrid rows={rotas} columns={columns} />;

  function handleDragStart(event, data) {
    event.dataTransfer.setData("application/json", JSON.stringify(data));
  }

  function handleDrop(event, dest) {
    event.preventDefault();
    const updatedRotas = [...rotas];

    const { filial, source } = JSON.parse(
      event.dataTransfer.getData("application/json")
    );

    console.log(filial, source, dest);

    let rotaSrc = transformToFiliaisArray(rotas[source.rotaIndex]);
    let rotaDest = transformToFiliaisArray(rotas[dest.rotaIndex]);

    console.log({ rotaSrc, rotaDest });

    if (rotaDest.filiais.length >= 3 && dest.rotaIndex !== source.rotaIndex) {
      alert("Rota cheia");
      return;
    }

    // debugger
    rotaSrc.filiais[source.filialIndex - 1] = null;
    rotaSrc.totalCubagem = calcTotalCubagem(rotaSrc.filiais);

    rotaDest.filiais.splice(
      dest.filialIndex,
      // dest.filialIndex === rotaDest.filiais.length
      //   ? dest.filialIndex
      //   : dest.filialIndex - 1,
      0,
      filial
    );
    rotaDest.totalCubagem = calcTotalCubagem(rotaDest.filiais);

    rotaSrc.filiais = rotaSrc.filiais.filter((f) => f !== null);

    updatedRotas[source.rotaIndex] = transformToFiliaisObject(rotaSrc);
    updatedRotas[dest.rotaIndex] = transformToFiliaisObject(rotaDest);

    setRotas(updatedRotas);
  }

  function calcTotalCubagem(filiais) {
    return filiais
      .filter((f) => f !== null)
      .reduce((acc, val) => acc + (val.cubagem || 0), 0);
  }
}

export default App;
