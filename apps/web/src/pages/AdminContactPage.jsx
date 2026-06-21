import React, {
  useEffect,
  useState,
} from "react";

const AdminContactPage = () => {

  const [contacts, setContacts] =
    useState([]);

    const [selectedContact, setSelectedContact] =
  useState(null);

  const fetchContacts = async () => {

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/contact/admin"
        );

      const data =
        await response.json();

      if (data.success) {
        setContacts(
          data.contacts
        );
      }

    } catch (error) {
      console.error(error);
    }

  };

  const handleResolve = async (
  id
) => {

  try {

    const response =
      await fetch(
        `http://localhost:5000/api/contact/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: "Resolved",
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {

      fetchContacts();

      alert(
        "Marked as Resolved ✅"
      );

    }

  } catch (error) {

    console.error(error);

  }
};

const handleDelete = async (
  id
) => {

  if (
    !window.confirm(
      "Delete this query?"
    )
  ) {
    return;
  }

  try {

    const response =
      await fetch(
        `http://localhost:5000/api/contact/${id}`,
        {
          method: "DELETE",
        }
      );

    const data =
      await response.json();

    if (data.success) {

      fetchContacts();

      alert(
        "Query deleted successfully ✅"
      );

    }

  } catch (error) {

    console.error(error);

  }
};

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10">

      <h1 className="text-3xl font-bold mb-8">
        Contact Queries
      </h1>

    {contacts.map(contact => (
  <div
    key={contact._id}
    className="bg-white shadow-md rounded-2xl p-6 mb-6"
  >
    <h2 className="text-xl font-bold">
      {contact.fullName}
    </h2>

    <p>{contact.email}</p>

    <p>{contact.phone}</p>

    <p>{contact.subject}</p>

    <p>{contact.message}</p>

    <p className="mt-3 mb-2">
  Status:

  <span
  className={`inline-block ml-2 px-3 py-1 rounded-full text-white ${
    contact.status === "Resolved"
      ? "bg-green-600"
      : "bg-yellow-500"
  }`}
>
  {contact.status || "Pending"}
</span>
</p>
<button
  onClick={() =>
    setSelectedContact(contact)
  }
  className="mt-4 mr-3 bg-blue-600 text-white px-5 py-2 rounded-lg"
>
  View Details
</button>
<button
  onClick={() =>
    handleDelete(
      contact._id
    )
  }
  className="ml-3 bg-red-600 text-white px-4 py-2 rounded-lg"
>
  Delete
</button>
{
contact.status ===
"Pending" && (
  <button
    onClick={() =>
      handleResolve(
        contact._id
      )
    }
    className="bg-green-600 text-white ml-2 px-4 py-2 rounded-lg"
  >
    Mark Resolved
  </button>

)

}

    

    
  </div>
))}

{
  selectedContact && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl">

        <h2 className="text-2xl font-bold mb-6">
          Customer Details
        </h2>

        <p className="mb-3">
          <strong>Name:</strong>{" "}
          {selectedContact.fullName}
        </p>

        <p className="mb-3">
          <strong>Email:</strong>{" "}
          {selectedContact.email}
        </p>

        <p className="mb-3">
          <strong>Phone:</strong>{" "}
          {selectedContact.phone}
        </p>

        <p className="mb-3">
          <strong>Subject:</strong>{" "}
          {selectedContact.subject}
        </p>

        <p className="mb-6">
          <strong>Message:</strong>
          <br />
          {selectedContact.message}
        </p>

        <button
          onClick={() =>
            setSelectedContact(null)
          }
          className="bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>
  )
}
    </div>
  );
};

export default AdminContactPage;