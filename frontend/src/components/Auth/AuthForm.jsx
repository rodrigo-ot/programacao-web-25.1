import { useState } from "react";

export default function AuthForm({ onSubmit, fields, title, submitText }) {
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{title}</h2>
      {fields.map((f) => (
        <div key={f.name} className="mb-4">
          <label htmlFor={f.name} className="block text-sm font-medium text-gray-700 mb-1">
            {f.label}
          </label>
          <input
            type={f.type || "text"}
            id={f.name}
            name={f.name}
            value={form[f.name] || ""}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      ))}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {submitText}
      </button>
    </form>
  );
}