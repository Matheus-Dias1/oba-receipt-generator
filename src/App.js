import React, { Component } from 'react';
import './App.css'
import stamp from './assets/stamp.png'

class App extends Component {

  state = {
    selectedFile: null,
    clicked: false,
    data: null,
    amountPerPage: ''
  };

  onFileChange = event => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
      if ('"' === l) {
        if (s && l === p) row[i] += l;
        s = !s;
      } else if (',' === l && s) l = row[++i] = '';
      else if ('\n' === l && s) {
        if ('\r' === p) row[i] = row[i].slice(0, -1);
        row = ret[++r] = [l = '']; i = 0;
      } else row[i] += l;
      p = l;
    }
    return ret;
  };

  amountChangeHandler = value => {
    this.setState({ amountPerPage: value })
  }

  onFileUpload = () => {
    if (this.state.selectedFile === null) return alert('Nenhum arquivo selecionado')
    if (this.state.amountPerPage === '') return alert('Digite a quantidade de canhotos por página')
    let read = new FileReader();
    read.readAsText(this.state.selectedFile);
    read.onloadend = () => {
      let data = this.csvToArray(read.result)
      const title = data[0].splice(0, 1)
      data[1].splice(0, 2)
      let obj = {
        title: title,
        route: data[0].splice(0, 1)[0],
        measurement_units: data[0].splice(0, data[0].length),
        products: data[1],
        schools: []
      }

      data.splice(0, 2)




      for (let i in data) {
        let newobj = {
          school: data[i][1],
          address: data[i][0]
        }
        data[i].splice(0, 2);
        newobj.amount = data[i]
        obj.schools.push(newobj)

      }

      this.setState({
        clicked: true,
        data: obj
      })

    }


  }




  render() {

    return (
      <div>
        {
          !this.state.clicked ?
            <div className="margin">

              <h1>
                Gerador de canhoto
			        </h1>
              <div>
                <input
                  type="text"
                  value={this.state.amountPerPage}
                  placeholder="Canhotos por página"
                  onChange={e => this.amountChangeHandler(e.target.value)}
                />
                <br />
                <br />
                <input type="file" onChange={this.onFileChange} />
                <button onClick={this.onFileUpload}>
                  Gerar
			        	</button>
              </div>
            </div>
            :
            <div className="App">
              <p>Rota {this.state.data.route}</p>
              {this.state.data.schools.map(school => {
                const shouldPrint = arr => {
                  const sum = arr.reduce((a, b) => parseInt(a, 10) + b, 0)
                  return sum > 0
                }
                return (
                  shouldPrint(school.amount) ?
                    <div
                      key={school.school}
                      className={((this.state.data.schools.indexOf(school) + 1) % parseInt(this.state.amountPerPage, 10)) ? '' : 'break'}>
                      <table key={school.school} >
                        <thead>
                          <tr>
                            <th colSpan="3" className="gray">{this.state.data.title}</th>
                          </tr>
                        </thead>
                        <tbody>

                          <tr>
                            <td colSpan="3">{school.school}<br />{school.address}</td>
                          </tr>
                          <tr className="gray">
                            <td>Descrição</td>
                            <td>Quantidade</td>
                            <td>Unidade</td>
                          </tr>
                          {
                            school.amount.map(iten => {
                              return (
                                <tr key={school.school + this.state.data.products[school.amount.indexOf(iten)]}>
                                  <td>{this.state.data.products[school.amount.indexOf(iten)]}</td>
                                  <td>{iten}</td>
                                  <td>{this.state.data.measurement_units[school.amount.indexOf(iten)]}</td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                      <div className="stampDiv">
                        <p>Uberlândia ___/___/_____</p>
                        <img src={stamp} alt="stamp" className="stamp" />
                      </div>
                    </div>
                    : null
                )
              })}

            </div>
        }
      </div>
    );
  }
}

export default App; 
