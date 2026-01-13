import { useGetBranchesQuery } from "@/components/store/api/branch/branchApi";
import { useEffect, useState } from "react";

export default function OurBranch() {
  const [search, setSearch] = useState("");
  const { data: branches } = useGetBranchesQuery({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter branches by name or address
  const filteredBranches =
    branches?.data?.filter(
      (branch) =>
        branch.name.toLowerCase().includes(search.toLowerCase()) ||
        branch.address?.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Our Branches</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search branches..."
          className="p-2 w-80 border rounded-lg text-black"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch: any) => (
          <div
            key={branch.id}
            className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition"
          >
            <h2 className="text-xl font-semibold mb-2">{branch.name}</h2>
            <p className="text-gray-300">
              {branch.address || "No address provided"}
            </p>

            {branch.shops?.length > 0 && (
              <p className="text-gray-400">{branch.shops.join(", ")}</p>
            )}

            {branch.offDay && (
              <p className="mt-2 font-semibold text-yellow-400">
                Off Day: {branch.offDay}
              </p>
            )}

            {(branch.phone1 || branch.phone2) && (
             <p className="text-gray-400 mt-2">
  ☎{" "}
  {[branch.phone1, branch.phone2].filter(Boolean).map((phone, index) => (
    <span key={phone}>
      <a href={`tel:${phone}`} className="hover:underline">
        {phone}
      </a>
      {index < [branch.phone1, branch.phone2].filter(Boolean).length - 1 && ", "}
    </span>
  ))}
</p>
            )}

            {branch.facebook && (
              <a
                href={branch.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 mt-2 block"
              >
                Visit Facebook Page
              </a>
            )}

            {branch.map && (
              <div className="mt-4">
                <iframe
                  src={branch.map}
                  width="100%"
                  height="100"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
