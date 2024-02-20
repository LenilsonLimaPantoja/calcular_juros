import { useState } from 'react';
import './Home.scss';
import { v4 as uuidv4 } from 'uuid';
const Home = () => {
    const [valores, setValores] = useState([]);
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
                id: uuidv4()
            };
        });
    }


    const handleRemoce = (id) => {
        let valoresRemover = valores.filter(item => item.id != id);
        setValores(valoresRemover);
    }


    return (
        <div className='container'>
            {valores.length < 1 &&
                <form onSubmit={handleSubmit}>
                    <label>
                        <span>Data inicial</span>
                        <input type="date" name='data_ini' />
                    </label>
                    <label>
                        <span>Valor Mensal</span>
                        <input type="number" name='valor_mensal' />
                    </label>
                    <label>
                        <span>Porcentagem (%) de juros</span>
                        <input type="number" name='taxa_mensal' value={taxaMensal} onChange={(e) => setTaxaMensal(e.target.value)} />
                    </label>
                    <button className='btn-calucular'>CALCULAR</button>
                    <button className='btn-limpar' type='reset'>LIMPAR</button>
                </form>
            }
            {valores.length > 0 &&
                <table cellSpacing={0}>
                    <thead>
                        <tr>
                            <th>DATA</th>
                            <th>Valor</th>
                            <th>Valor com correção ({taxaMensal}%)</th>
                            <th>Meses em Atraso</th>
                            <th>####</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            valores?.map((item, index) => (
                                <tr key={index}>
                                    <td>{`${item.mes}/${item.ano}`}</td>
                                    <td>R$ {item.valor_original?.toFixed(2)}</td>
                                    <td>R$ {item.valor_corrigido?.toFixed(2)}</td>
                                    <td>{item.diferencaMeses}</td>
                                    <td>
                                        <button title='Remover' onClick={() => handleRemoce(item.id)}>remover</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }
        </div>
    )
}
export default Home;