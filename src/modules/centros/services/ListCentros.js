import {api} from "../../../core/config/api/consumo";
export default function ListaCentrosApi(){
    const ListCentros = await api.get("/centros");
    return ListCentros.data;
}