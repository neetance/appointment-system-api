import {Appointment} from '../models/Appointment';
import {Professor} from '../models/Professor';
import {Student} from '../models/Student';

export async function addTimeSlot(req, res) {
    try {
        const prof_id = req.user.professor_Id;
        const professor = await Professor.findOne({ professor_Id: prof_id });
        if (!professor) 
            return res.status(400).send("Invalid professor ID");

        const { date } = req.body;
        const appointment = new Appointment({
            professor: professor._id,
            date,
            status: 'free'
        });

        await appointment.save();
        res.status(200).send("Time slot added successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function getAllFreeTimeSlots(req, res) {
    try {
        const prof_id = req.body.professor_Id;
        const professor = await Professor.findOne({ professor_Id: prof_id });
        if (!professor) 
            return res.status(400).send("Invalid professor ID");

        const appointments = await Appointment.find({ professor: professor._id, status: 'free' });
        res.status(200).json(appointments);
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function bookAppointment(req, res) {
    try {
        const roll_no = req.user.roll_no;
        const student = await Student.findOne({ roll_no });

        const appointment_id = req.body.appointment_id;
        const appointment = await Appointment.findOne({ _id: appointment_id });
        if (!appointment)
            return res.status(400).send("Invalid appointment ID");

        if (appointment.status === 'booked')
            return res.status(400).send("Appointment already booked");

        appointment.status = 'booked';
        appointment.student = student._id;

        await appointment.save();
        res.status(200).send("Appointment booked successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function studentCancelAppointment(req, res) {
    try {
        const roll_no = req.user.roll_no;
        const student = await Student.findOne({ roll_no });

        const appointment_id = req.body.appointment_id;
        const appointment = await Appointment.findOne({ _id: appointment_id });
        if (!appointment)
            return res.status(400).send("Invalid appointment ID");

        if (appointment.status === 'free')
            return res.status(400).send("Appointment already free");

        if (appointment.student.toString() !== student._id.toString())
            return res.status(400).send("Appointment not booked by you");

        appointment.status = 'free';
        appointment.student = null;

        await appointment.save();
        res.status(200).send("Appointment cancelled successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function professorCancelAppointment(req, res) {
    try {
        const prof_id = req.user.professor_Id;
        const professor = await Professor.findOne({ professor_Id: prof_id });
        if (!professor) 
            return res.status(400).send("Invalid professor ID");

        const appointment_id = req.body.appointment_id;
        const appointment = await Appointment.findOne({ _id: appointment_id });
        if (!appointment)
            return res.status(400).send("Invalid appointment ID");

        if (appointment.status === 'free')
            return res.status(400).send("Appointment already free");

        if (appointment.professor.toString() !== professor._id.toString())
            return res.status(400).send("Appointment not booked by you");

        await appointment.delete();
        res.status(200).send("Appointment cancelled successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function getStudentAppointments(req, res) {
    try {
        const roll_no = req.user.roll_no;
        const student = await Student.findOne({ roll_no, });
        if (!student)
            return res.status(400).send("Invalid roll number");

        const appointments = await Appointment.find({ student: student._id, date: { $gte: new Date() } });
        res.status(200).json(appointments);
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function getProfessorAppointments(req, res) {
    try {
        const prof_id = req.user.professor_Id;
        const professor = await Professor.findOne({ professor_Id: prof_id });
        if (!professor) 
            return res.status(400).send("Invalid professor ID");

        const appointments = await Appointment.find({ professor: professor._id, date: { $gte: new Date() }, status: 'booked' });
        res.status(200).json(appointments);
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}
