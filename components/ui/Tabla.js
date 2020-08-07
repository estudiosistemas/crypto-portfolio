import styled from "@emotion/styled";

export const Tabla = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 0.75rem;

  tfoot {
    background-color: var(--gris3);
    font-size: 0.85rem;
  }

  th {
    height: 40px;
    background-color: var(--gris2);
    color: white;
  }

  th,
  td {
    display: table-cell;
    padding: 5px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  td::before {
    display: none;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

  @media (max-width: 767px) {
    th {
      display: none;
    }

    td {
      display: block;
      border-bottom: 0;
    }

    td:first-of-type {
      padding-top: 0.5em;
    }

    td:last-of-type {
      padding-bottom: 0.5em;
      border-bottom: 2px solid #ddd;
    }

    td::before {
      content: attr(data-th) ": ";
      font-weight: bold;
      width: 8.5em;
      display: inline-block;
    }
  }
`;

export const CeldaNumero = styled.div`
  text-align: right;
`;

export const CeldaPosicion = styled.div`
  text-align: right;
  color: ${(props) => (props.positivo ? "green" : "red")};
`;
