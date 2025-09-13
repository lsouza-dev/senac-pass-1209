import React from "react";

const Status = ({ name = "", label = "", value = "", tableCard = false }) => {
  function verificarStatus(value) {
    if (!tableCard) {
      if (value === "Emitido" || value === 0) return "laranja";
      else if (value === "Validado" || value === 1) return "verde";
    }

    console.log(value);
    switch (value) {
      case "Baixa":
        return "verde";
      case "Media":
        return "amarelo";
      case "Alta":
        return "laranja";
      case "Lotado":
        return "laranja";
      default :
        return 'azul'
    }
  }
  return (
    <>
      {!tableCard && (
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-semibold ">Status</p>
          <span
            className={`bg-${verificarStatus(value)} w-1/5 p-4 rounded-md text-center font-semibold text-xl`}
          >
            {value}
          </span>
        </div>
      )}
      {tableCard && value =='Baixa' && <span className={`bg-verde/70 rounded-md border-verde text-center font-semibold text-xl p-3 `}>{value} Lotação</span>}
      {tableCard && value =='Media' && <span className={`bg-amarelo/60 rounded-md text-center border-amarelo font-semibold text-xl p-3 `}>{value} Lotação</span>}
      {tableCard && value =='Alta' && <span className={`bg-laranja/30 rounded-md text-center font-semibold border-laranja text-xl p-3 `}>{value} Lotação</span>}
      {tableCard && value =='Lotado' && <span className={`bg-laranja rounded-md text-center font-semibold text-xl p-3 `}>{value}</span>}
    </>
  );
};

export default Status;
