export default class Alumno {
    constructor(username, dni, edad) {
        this.username = username;
        this.dni = dni;
        this.edad = edad;
    }

    toString() {
        return `Alumno: ${this.username}, DNI: ${this.dni}, Edad: ${this.edad}`;
    }
    buscarAlumno(dni) {
        const alumno = alumnosArray.find(a => String(a.dni) === String(req.params.dni));

        if (!alumno) return res.status(404).send("No encontrado");

    }
}

