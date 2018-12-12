import React from 'react'

const Kurssi = ({ kurssi }) => {
    return (
        <div>
            <Otsikko kurssi={kurssi.nimi} />
            <Sisalto osat={kurssi.osat} />
            <Yhteensa osat={kurssi.osat} />
        </div>
    )
}

const Otsikko = ({ kurssi }) => {
    return (
        <div>
            <h1>{kurssi}</h1>
        </div>
    )
}

const Sisalto = ({ osat }) => {
    return (
        osat.map(osa => <Osa key={osa.id} osa={osa.nimi} tehtavia={osa.tehtavia} />)
    )
}

const Osa = ({ osa, tehtavia }) => {
    return (
        <p>{osa} {tehtavia}</p>
    )
}

const Yhteensa = ({ osat }) => {
    return (
        <div>
            <p>yhteesä {osat.reduce((accumulator, currentValue) => accumulator + currentValue.tehtavia, 0)}</p>
        </div>
    )
}

export default Kurssi