import React from 'react';
import ReactDOM from 'react-dom';
import 'bootswatch/dist/sketchy/bootstrap.min.css'; // Added this :boom:
//import './index.css';


const carne_regex = new RegExp('[0-9]{8}');

class CellButton extends React.Component{
    render(){
        return (
        <button 
            className='btn btn-danger'
            onClick={()=>{
                this.props.onClick();
            }}
            >{'DELETE?'}
        </button>);
    }
}

class Cell extends React.Component {
    render() {
        return(
            <td>{this.props.value}</td>
        );
    }
}

class Row extends React.Component {

    renderCell() {
        const student = this.props.student;
        let studentArray = Object.values(student);
        let cells = studentArray.map((value, index)=>{
            return <Cell value={studentArray[index]} key={index} />
        });
        return cells;
    }

    render() {
        const position = this.props.position;
        return (
            <tr className='table-active'>
                {this.renderCell()}
                <td>
                {
                    <CellButton 
                        value={position}
                        onClick={()=>{
                            this.props.onClick(position);
                        }}
                    />
                }</td>
            </tr>
        );
    }
}

class Table extends React.Component {
    renderRow() {
        const student_list = this.props.value;
        if (!student_list[0]) {
            return;
        }
        else{
            if(!student_list[0].carnet) {
                return;
            }
            else {
                const rows = student_list.map((object, index)=>{
                //console.log(index);
                return <Row 
                student={object} 
                key={index} 
                position={index}
                onClick={()=>{
                    this.props.onClick(index);
                }}
                />;});

                return rows;
            }
        }
    }
    
    render() {
        return(
            <table className="table table-hover">
            <thead>
                <tr className="table-dark">
                    <th scope="col">Carnet</th>
                    <th scope="col">Horario de laboratorio</th>
                    <th scope="col">Tarde?</th>
                    <th scope="col">Hora de ingreso</th>
                    <th scope="col">Eliminar</th>
                </tr>
            </thead>
                <tbody id="table_body">
                    {   
                        this.renderRow()
                    }
                </tbody>
            </table>
        );
    }
}

class FormGroup extends React.Component {
    parseLateSwitch = (value) => {
        if(value) {
            return 'Tarde ';
        }
        return ' A tiempo';
    }
    
    render() {
        return(
            <div className="jumbotron">
            <h1>
                Registro de laboratorio.
            </h1>
    
            <div className="form-group">
                <label htmlFor="carnet" className="col-sm-2 col-form-label">Ingrese el carnet: </label>
                <br></br>
                <input className="form-control" type="text" name="carnet" id="carnet_field" maxlength="8"
                    onKeyUp={
                        (event)=>{
                            const keyCode = event.keyCode;
                            const submit_btn = document.querySelector("#submit_btn");

                            if(keyCode === 13) {
                                submit_btn.click();
                            }
                        }
                    }
                ></input>
            </div>
    
            <div className="form-group">
                <label htmlFor="schedule">Seleccione el horario:</label>
                <select name="schedule" className="form-control" id="schedule_field">
                    <option>Lunes de 9:00 a 11.00</option>
                    <option>Martes de 13:30 a 15:30</option>
                    <option>Miércoles de 9:00 a 11.00</option>
                    <option>Jueves de 13:30 a 15:30</option>
                    <option>Viernes de 9:00 a 11.00</option>
                    <option>Viernes de 15:30 a 17:30</option>
                </select>
            </div>
            
            <div className="form-group">
                <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="late_switch"></input>
                    <label className="custom-control-label" htmlFor="late_switch">Llegó tarde?</label>
                </div>
            </div>
    
            <div className="form-group">
                <button type="button" className="btn btn-danger" id="submit_btn"
                onClick={
                    ()=>{
                        const carnet = document.querySelector("#carnet_field").value;
                        const schedule_dropdown = document.querySelector("#schedule_field")
                        const schedule = schedule_dropdown.options[schedule_dropdown.selectedIndex].text;
                        const checkbox = document.querySelector("#late_switch");
                        const late = this.parseLateSwitch(checkbox.checked);

                        if(carne_regex.test(carnet)) {
                            this.props.onClick(carnet, schedule, late);
                        }
                        else {
                            alert('Formato de carnet no valido ');
                        }
                    }
                } >Ingresar</button>
            </div>
        </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student_list: [{
                carnet: null, 
                schedule: null, 
                late: null,
                entry: null
            }]
        }
    }

    handleDelete(position) {
        const student_list = this.state.student_list.slice();
      
        student_list.splice(position, 1);
        this.setState({
            "student_list": student_list
        });
    }

    handleAdd(carnet, schedule, late) {
        const student_list = this.state.student_list.slice();
        let date = new Date();
        let datetime_string = date.toLocaleString();
        if(!student_list[0]) {
            student_list[0] = {
                "carnet": carnet, 
                "schedule": schedule, 
                "late": late,
                "entry": datetime_string
            }
            this.setState({
                'student_list': student_list
            });
        }
        else {
            if (!student_list[0].carnet) {
                student_list[0] = {
                    "carnet": carnet, 
                    "schedule": schedule, 
                    "late": late,
                    "entry": datetime_string
                }
                this.setState({
                    'student_list': student_list
                });
            }
            else{
    
                student_list.push({
                    "carnet": carnet, 
                    "schedule": schedule, 
                    "late": late,
                    "entry": datetime_string
                });
                this.setState({
                    'student_list': student_list
                });
            }
        }
    }
    
    render() {
        return(
            <div className='container'>
                <br></br>
               <FormGroup 
                   value={this.state.student_list} 
                   onClick={(carnet, schedule, late)=>{
                   this.handleAdd(carnet, schedule, late)
               }}/>
            <section>
                <Table
                    value={this.state.student_list}
                    onClick={(position)=>{
                        this.handleDelete(position);
                    }}
                />
            </section>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);