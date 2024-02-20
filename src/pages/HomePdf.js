import {
    Document,
    Page,
    Text,
    StyleSheet,
    View,
} from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";

import React, { useEffect, useState } from "react";

const styles = StyleSheet.create({
    body: {
        padding: 40,
    },
    text: {
        fontSize: 12,
        fontFamily: "Times-Roman",
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "justify",
    },
    cabecalho: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    cabecalhoCard1: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        width: "auto",
        borderColor: "#bfbfbf",
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    containerRow: {
        flexDirection: "row",
    },
    thead: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#FBFBFB'
    },
    th: {
        flexGrow: 1,
        fontSize: 10,
        textAlign: 'center',
        padding: 10,
        textAlign: 'left',
        fontFamily: "Times-Roman",
    },
    tbody: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#FBFBFB'
    },
    td: {
        fontFamily: "Times-Roman",
        flexGrow: 1,
        fontSize: 8,
        textAlign: 'center',
        padding: 10,
        textAlign: 'left',
        fontStyle: 'italic'
    },
});

function HomePdf() {
    const [valores, setValores] = useState([]);
    const [valoresTotais, setValoresTotais] = useState([]);
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    useEffect(() => {
        const dados = localStorage.getItem('@pdf_juros');
        const totais = localStorage.getItem('@pdf_juros_totais');
        setValores(JSON.parse(dados));
        setValoresTotais(JSON.parse(totais));
    }, [])
    return (
        <PDFViewer
            style={{ width: "100%", maxHeight: "100vh", minHeight: "100vh" }}
        >
            <Document>
                <Page style={styles.body} wrap>
                    <View style={styles.cabecalho} fixed>
                        <View style={styles.cabecalhoCard1}>
                            {/* <Image src={imagemLogoGe} style={{ width: 150 }} /> */}
                            <Text
                                style={[
                                    styles.text,
                                    {
                                        fontSize: 12,
                                        fontFamily: "Times-Bold",
                                        marginTop: -10,
                                    },
                                ]}
                            >
                                RELATÓRIO
                            </Text>
                            <Text style={[styles.text, { fontSize: 12 }]}>
                                CALCULO DE JUROS POR PERIODO
                            </Text>
                            <Text style={[styles.text, { fontSize: 12 }]}>
                                {String(valores[0]?.mes).padStart('2', 0)}/{String(valores[0]?.ano).padStart('2', 0)} à {String(valores[valores?.length - 1]?.mes).padStart('2', 0)}/{String(valores[valores?.length - 1]?.ano).padStart('2', 0)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.container}>
                        <View style={styles.table}>
                            <View style={styles.thead}>
                                <Text style={[styles.th, { width: '18%' }]}>Data</Text>
                                <Text style={[styles.th, { width: '18%' }]}>Atraso</Text>
                                <Text style={[styles.th, { width: '18%' }]}>Valor</Text>
                                <Text style={[styles.th, { width: '46%' }]}>Valor Corrigido (2% mensal)</Text>
                            </View>
                            {
                                valores?.map((item, index) => (
                                    <View style={[styles.tbody, { backgroundColor: index % 2 === 0 ? '#fff' : '#FBFBFB' }]} key={index}>
                                        <Text style={[styles.td, { width: '18%' }]}>{`${String(item.mes).padStart('2', 0)}/${item.ano}`}</Text>
                                        <Text style={[styles.td, { width: '18%' }]}>{item.diferencaMeses} MESES</Text>
                                        <Text style={[styles.td, { width: '18%' }]}>R$ {item.valor_original?.toFixed(2)}</Text>
                                        <Text style={[styles.td, { width: '46%' }]}>R$ {item.valor_corrigido?.toFixed(2)}</Text>
                                    </View>
                                ))
                            }
                            <View style={[styles.tbody, {marginTop: 20}]}>
                                <Text style={[styles.td, { width: '54%', fontFamily: 'Times-Bold', fontSize: 10 }]}>Valor Original a Receber</Text>
                                <Text style={[styles.td, { width: '46%', fontFamily: 'Times-Bold', fontSize: 10 }]}>R$ {valoresTotais?.valor_original?.toFixed(2)}</Text>
                            </View>
                            <View style={[styles.tbody]}>
                                <Text style={[styles.td, { width: '54%', fontFamily: 'Times-Bold', fontSize: 10 }]}>Valor Corrigido a Receber</Text>
                                <Text style={[styles.td, { width: '46%', fontFamily: 'Times-Bold', fontSize: 10 }]}>R$ {valoresTotais?.valor_corrigido?.toFixed(2)}</Text>
                            </View>
                        </View>
                        <View style={[styles.containerRow, { justifyContent: "space-between", marginTop: 50 }]}>
                            <View style={{ border: "dashed", borderTopWidth: 1, width: "35%" }}>
                                <Text style={[styles.text, { textAlign: "center" }]}>
                                    Kevin Bravo da Costa Fredo
                                </Text>
                            </View>

                            <View
                                style={{ border: "dashed", borderTopWidth: 1, width: "50%" }}
                            >
                                <Text style={[styles.text, { textAlign: "center" }]}>
                                    Campo Grande MS, {dia}/{mes}/{ano}.
                                </Text>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
}

export default HomePdf;
