import Appointment from '../models/AppointmentModel.js';
import Student from '../models/StudentModel.js';
import Professor from '../models/ProfessorModel.js';
import { sendMail } from '../mailer.js';

/**
 * @dev Used to add a free time slot for a professor
 * NOTE Can only be accessed by a professor
 */

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
        res.status(200).json({
            message: "Time slot added successfully",
            appointment_id: appointment._id,
            date: appointment.date
        });
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

/**
 * @dev Used to get all free time slots of a professor
 * NOTE Does not require authentication
 */

export async function getAllFreeTimeSlots(req, res) {
    try {
        const prof_id = req.query.professor_Id;
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

/**
 * @dev Used to book an appointment with a professor by a student
 * NOTE 1. Can only be accessed by a student
 *      2. The appointment must be free
 *      3. Sends a confirmation mail to both the student and the professor
 */

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

        const professor = await Professor.findOne({ _id: appointment.professor });
        const subject = "Appointment Booked";
        const textProfMail = `Your appointment has been booked by ${student.name} on ${appointment.date}`;
        sendMail(professor.email, subject, textProfMail);

        const textStudentMail = `Your appointment with ${professor.name} has been booked on ${appointment.date}`;
        sendMail(student.email, subject, textStudentMail);
        
        res.status(200).json({
            message: "Appointment booked successfully",
            appointment_id: appointment._id,
            date: appointment.date,
            professor: {
                name: professor.name,
                id: professor.professor_Id
            },
            student: {
                name: student.name,
                roll_no: student.roll_no
            }
        });
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

/**
 * @dev Used to cancel an appointment by a student
 * NOTE 1. Can only be accessed by a student
 *      2. The appointment must be booked by the student
 *      3. Sends a cancellation mail to both the student and the professor
 */

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

        const professor = await Professor.findOne({ _id: appointment.professor });
        const subject = "Appointment Cancelled";
        const textProfMail = `Your appointment has been cancelled by ${student.name} on ${appointment.date}. This time slot is now free`;
        sendMail(professor.email, subject, textProfMail);

        const textStudentMail = `Your appointment with ${professor.name} on ${appointment.date} has been cancelled`;
        sendMail(student.email, subject, textStudentMail);

        res.status(200).send("Appointment cancelled successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

/**
 * @dev Used to cancel an appointment by a professor
 * NOTE 1. Can only be accessed by a professor
 *      2. The appointment must be booked by the professor
 *      3. Sends a cancellation mail to both the student and the professor
 */

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

        await appointment.deleteOne();

        const student = await Student.findOne({ _id: appointment.student });
        const subject = "Appointment Cancelled";
        const textProfMail = `Your appointment with ${student.name} on ${appointment.date} has been cancelled`;
        sendMail(professor.email, subject, textProfMail);

        const textStudentMail = `Your appointment with ${professor.name} on ${appointment.date} has been cancelled by the them.`;
        sendMail(student.email, subject, textStudentMail);
        
        res.status(200).send("Appointment cancelled successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

/**
 * @dev Used to get all pending appointments of a student
 * NOTE Can only be accessed by the student
 */

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

/**
 * @dev Used to get all pending appointments of a professor
 * NOTE Can only be accessed by the professor
 */

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
