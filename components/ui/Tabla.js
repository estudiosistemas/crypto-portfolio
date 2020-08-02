import styled from "@emotion/styled";

export const Tabla = styled.table`
  border-collapse: collapse;
  width: 100%;

  tfoot {
    background-color: var(--gris3);
  }

  th {
    height: 50px;
    background-color: var(--gris2);
    color: white;
  }

  th,
  td {
    padding: 5px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
`;

export const CeldaNumero = styled.div`
  text-align: right;
`;

export const CeldaPosicion = styled.div`
  text-align: right;
  color: ${(props) => (props.positivo ? "green" : "red")};
`;
