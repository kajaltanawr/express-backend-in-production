import { Student } from "../models/student.model.js";

const createStudent = async (req, res) => {
    try {
        const { username, email } = req.body
        const findByUsername = await Student.findOne({ username })
        if (findByUsername) {
            return res.status(400).json({ message: "Username already exists" })
        }
        const findByEmail = await Student.findOne({ email })

        if (findByEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const student = new Student(req.body);
        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}
const getAllStudents = async (_, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
            // to get updated student
            // if it is false or not given
            // this method will return prev student
            new: true
        });
        console.log("updatedStudent ", updatedStudent)
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const getStudentByIdAndReturnFullName = async (req, res) => {
    // TODO get student id from request
    const { id } = req.params
    // TODO get student by id from db
    const found = await Student.findById(id)
    // TODO get fullname from your model using custom method
    // and return response
    if (!found) {
        return res.status(404).json({ message: "Student not found" })
    }
    res.status(200).json({ fullName: found.fullName() })

}
const login = async (req, res) => {
    // TODO get data from request
    const { username, password } = req.body
    console.log("username ", username)
    console.log("password ", password)
    // TODO check student exists or not
    // find student in database


    const student = await Student.findOne({ username })
    // you can ignore value part in js 
    // if you have same name for key and value
    // const student = Student.find({username})
    // TODO if student not found return failed res
    console.log("Student ", student)
    if (!student) {
        return res.status(400).json({ message: "user not found" })
    }

    // TODO match password
    // if password matched - 
    // return success response 
    // if not matched - return failed response
    if (student.comparePassword(password)) {
        res.status(200)
            .json(student)
    } else {
        res.status(400).json({ message: "Wrong pasword" })
    }
}
const uploadFile = async (req, res) => {
    console.log("req.file", req.file);
    if (req.file) {
        const updatedStudent = await Student.findByIdAndUpdate(req.body.id, { profilePhoto: req.file.filename })
        if (updatedStudent) {
            return res.status(200).json({ message: "File uploaded and student updated" });
        }
        return res.status(200).json({ message: "File uploaded but student not updated" });
    } else {
        res.status(400).json({ message: "File not uploaded" });
    }
}

export default {
    createStudent,
    getAllStudents,
    getStudentById,
    deleteStudent,
    updateStudent,
    getStudentByIdAndReturnFullName,
    login,
    uploadFile
}