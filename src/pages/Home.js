import { useState } from 'react';
import './Home.scss';
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";

import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const redirect = useNavigate();
    const [valores, setValores] = useState([]);
    const [total, setTotal] = useState([{ valor_original: 0, valor_corrigido: 0 }]);
    const [taxaMensal, setTaxaMensal] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);
        console.log(formValues);


        // var inputProcentagem = document.getElementById('procentagem').value;
        var dataInicial = new Date(formValues.data_ini);
        var dataAtual = new Date();

        var arrayValoresPorMes = [];
        var dataTemp = new Date(dataInicial);

        while (dataTemp <= dataAtual) {
            arrayValoresPorMes.push({ mes: dataTemp.getMonth() + 1, ano: dataTemp.getFullYear(), valor: formValues.valor_mensal });
            dataTemp.setMonth(dataTemp.getMonth() + 1); // Incrementa a data em 1 mês
        }
        console.log(arrayValoresPorMes);
        const taxaJurosMensal = `0.0${formValues.taxa_mensal}`; // 5% ao mês

        let valoresComJuros = calcularJuros(arrayValoresPorMes, taxaJurosMensal);
        console.log(valoresComJuros);
        setValores(valoresComJuros);
        let totalvalores = { valor_original: 0, valor_corrigido: 0 };
        valoresComJuros?.map((item) => {
            if (!item.checkd && item.diferencaMeses > 0) {
                totalvalores.valor_original = totalvalores.valor_original + item.valor_original;
                totalvalores.valor_corrigido = totalvalores.valor_corrigido + item.valor_corrigido;
            }
        });
        setTotal(totalvalores);
    }





    // Função para calcular o valor dos juros para cada entrada no array
    function calcularJuros(array, taxaJurosMensal) {
        const dataAtual = new Date();

        return array.map(item => {
            const valor = parseFloat(item.valor); // Converte o valor para número

            // Cria uma nova data referente ao mês e ano do item
            const dataReferida = new Date(item.ano, item.mes - 1); // O mês é zero-based, então subtraímos 1

            // Calcula o número de meses entre a data referida e a data atual
            const diferencaMeses = (dataAtual.getFullYear() - dataReferida.getFullYear()) * 12 + (dataAtual.getMonth() - dataReferida.getMonth());

            // Calcula o valor dos juros considerando a diferença de meses
            let juros = valor * taxaJurosMensal + valor;
            for (let i = 0; i < diferencaMeses; i++) {
                juros = juros + (juros * taxaJurosMensal);
            }
            return {
                mes: item.mes,
                ano: item.ano,
                valor_original: valor,
                valor_corrigido: juros, // Calcula o valor total (valor + juros)
                diferencaMeses: diferencaMeses,
                checkd: diferencaMeses > 0 ? false : true,
                id: uuidv4()
            };
        });
    }


    const handleRemoce = (id) => {
        let valoresRemover = valores.filter((item) => {
            if (item.id != id) {
                return item;
            }
            if (item.id === id && item.checkd) {
                item.checkd = false;
                return item;
            }
            if (item.id === id && !item.checkd) {
                item.checkd = true;
                return item;
            }
        });

        setValores(valoresRemover);
        let totalvalores = { valor_original: 0, valor_corrigido: 0 };
        valoresRemover?.map((item) => {
            if (!item.checkd && item.diferencaMeses > 0) {
                totalvalores.valor_original = totalvalores.valor_original + item.valor_original;
                totalvalores.valor_corrigido = totalvalores.valor_corrigido + item.valor_corrigido;
            }
        });
        setTotal(totalvalores);
    }


    const handleGerarPDF = async (e) => {
        e.preventDefault();
        localStorage.setItem('@pdf_juros', JSON.stringify(valores))
        localStorage.setItem('@pdf_juros_totais', JSON.stringify(total))
        redirect('/home-pdf')
    }
    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Data inicial</span>
                    <input type="date" name='data_ini' />
                </label>
                <label>
                    <span>Valor Mensal</span>
                    <input type="tel" name='valor_mensal' />
                </label>
                <label>
                    <span>Porcentagem (%) de juros</span>
                    <input type="tel" name='taxa_mensal' value={taxaMensal} onChange={(e) => setTaxaMensal(e.target.value)} />
                </label>
                <button className='btn-calucular'>CALCULAR</button>
                <button className='btn-limpar' type='reset'>LIMPAR</button>
            </form>
            {valores.length > 0 &&
                <>
                    <form onSubmit={handleGerarPDF}>
                        <button className='btn-calucular'>GERAR PDF</button>
                    </form>
                    <div className='valores-totais'>
                        <span>Valor Original a Receber: R$ {total.valor_original?.toFixed(2)}</span>
                        <span>Valor Corrigido a Receber: R$ {total.valor_corrigido?.toFixed(2)}</span>
                    </div>
                    <table cellSpacing={0}>
                        <tbody>
                            {
                                valores?.map((item, index) => (
                                    <tr key={index}>
                                        <td class="teste">
                                            <span className='data'>{`${String(item.mes).padStart('2', 0)}/${item.ano}`}</span>
                                            <span className='valores'>Meses em atraso: {item.diferencaMeses}</span>
                                            <span className='valores'>Valor original: R$ {item.valor_original?.toFixed(2)}</span>
                                            <span className='valores'>Correção de {taxaMensal}% ao mês: R$ {item.valor_corrigido?.toFixed(2)}</span>
                                            <button className={`btn-${item.diferencaMeses === 0 || item.checkd ? 'green' : 'red'}`}>{item.diferencaMeses === 0 || item.checkd ? item.diferencaMeses === 0 ? 'aberto' : 'pago' : 'atrasado'}</button>
                                        </td>
                                        <td>
                                            {item.checkd ?
                                                <GrCheckboxSelected onClick={() => handleRemoce(item.id)} />
                                                :
                                                <GrCheckbox onClick={() => handleRemoce(item.id)} />
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </>
            }
        </div>
    )
}
export default Home;