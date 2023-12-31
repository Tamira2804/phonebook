import { useDispatch, useSelector } from 'react-redux';
import { addContact } from '../../redux/contacts/contacts-operations';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './ContactForm.scss';
import { selectContactsList } from '../../redux/contacts/contacts-selectors';
import { nanoid } from '@reduxjs/toolkit';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .matches(/^[a-zA-Zа-яА-ЯІіЇїҐґ' \-\u0400-\u04FF]+$/, 'Invalid characters'),
  number: Yup.string()
    .required('Number is required')
    .matches(
      /^\d{3}-\d{3}-\d{4}$/,
      'Invalid phone number. Please use the format 111-111-1111'
    ),
});

const initialValues = {
  name: '',
  number: '',
};

const ContactForm = () => {
  const dispatch = useDispatch();
  const contactsList = useSelector(selectContactsList);

  const handleSubmit = (values, { resetForm }) => {
    const { name, number } = values;

    const isContactDuplicate = () => {
      return contactsList.some(
        contact => contact.name.toLowerCase() === name.toLowerCase()
      );
    };

    if (isContactDuplicate()) {
      alert(`${name} is already in contacts`);
    } else {
      const newContact = {
        id: nanoid(),
        name: name,
        number: number,
      };

      dispatch(addContact(newContact));
    }
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="Form__container">
        <label htmlFor="nameId" className="Form__label">
          Name
        </label>
        <Field
          className="Form__input"
          type="text"
          placeholder="Jon Doe"
          name="name"
          id="nameId"
          required
        />
        <ErrorMessage name="name" component="div" className="Error" />

        <label htmlFor="numberId" className="Form__label">
          Number
        </label>
        <Field
          className="Form__input"
          type="tel"
          placeholder="123-456-7890"
          name="number"
          id="numberId"
          required
        />
        <ErrorMessage name="number" component="div" className="Error" />

        <button type="submit" className="AddContact__btn">
          Add Contact
        </button>
      </Form>
    </Formik>
  );
};

export default ContactForm;
