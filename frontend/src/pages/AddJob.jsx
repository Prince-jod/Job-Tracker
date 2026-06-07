import { useState } from "react";
import API from "../api/axios";
function AddJob() {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "applied",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post("/jobs", formData);

    console.log(response.data);

    alert("Job Added Successfully");

    setFormData({
      company: "",
      position: "",
      status: "applied",
    });

  } catch (error) {
    console.error(error);
    alert("Failed to add job");
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-5">Add Job</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="position"
          placeholder="Job Position"
          value={formData.position}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Job
        </button>
      </form>
    </div>
  );
}

export default AddJob;