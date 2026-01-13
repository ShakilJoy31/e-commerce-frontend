import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import Pagination from "@/components/ui/pagination";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { useGetCustomersQuery, useAddSmMessageMutation } from "@/components/store/api/customers/customersApi";
import { useGetCustomMessageQuery } from "@/components/store/api/customMessage/customMessage";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import SearchableSelect from "../products/SearchableSelect";
import toast from "react-hot-toast";
import Table from "@/components/ui/table";

const SendMessage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTag] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [messageType, setMessageType] = useState<"custom" | "template">("template");
  const [searchableSelectKey, setSearchableSelectKey] = useState(0);

  const headers = [
    "SERIAL",
    "Name",
    "Email",
    "Contact No",
  ];

  const [pagination, setPagination] = useState({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: null,
      size: null,
      total: null,
      totalPage: null,
    },
  });

  const { data, isLoading, isError } = useGetCustomersQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const { data: messageTemplate, isLoading: messageLoading } = useGetCustomMessageQuery({
    page: pagination.page,
    size: pagination.size,
    search: searchTag,
  });

  const [addSmMessage, { isLoading: isSending }] = useAddSmMessageMutation();

  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        meta: {
          page: data.meta.page,
          size: data.meta.size,
          total: data.meta.total,
          totalPage: data.meta.totalPage,
        },
      }));
    }
  }, [data]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination((prev) => ({
      ...prev,
      size: itemsPerPage,
      page: 1,
    }));
  };

  const toggleRowSelection = (user: any) => {
    setSelectedRows(prev => 
      prev.some(u => u.id === user.id) 
        ? prev.filter(u => u.id !== user.id) 
        : [...prev, user]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows(prev => 
      prev.length === data?.data?.length 
        ? [] 
        : data?.data || []
    );
  };


  const handleSendMessage = async () => {
    if ((messageType === "template" && !selectedMessage) || 
        (messageType === "custom" && !customMessage) || 
        selectedRows.length === 0) {
      return;
    }

    const finalMessage = messageType === "template" ? selectedMessage : customMessage;
  
    try {
      const messageData = {
        customers: selectedRows.map(recipient => recipient.id), 
        message: finalMessage
      };
      
      await addSmMessage(messageData).unwrap();
      
      toast.success(`Message sent to ${selectedRows.length} ${selectedRows.length === 1 ? 'recipient' : 'recipients'}`);
      
      setSelectedRows([]);
      setSelectedMessage("");
      setCustomMessage("");
      setSearchableSelectKey(prev => prev + 1);
      
    } catch (error) {
      console.error("Failed to send messages:", error);
      toast.error("Failed to send messages");
    }
  };

  const handleTemplateSelect = (value: string) => {
    setSelectedMessage(value === "none" ? "" : value);
  };

  const handleCustomMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomMessage(e.target.value);
  };

  const removeSelectedRecipient = (id: string) => {
    setSelectedRows(prev => prev.filter(u => u.id !== id));
  };

  if (isLoading) return <LoaderSpinner />;

  return (
    <PageWrapper>
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="bg-white rounded-lg p-4 mb-4 space-y-4">
          <h2 className="text-lg font-semibold">Send Custom Message</h2>
          
          {/* Selected Recipients */}
          {selectedRows.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2">Selected Recipients ({selectedRows.length}):</h3>
              <div className="flex flex-wrap gap-2">
                {selectedRows.map(recipient => (
                  <div 
                    key={recipient.id} 
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {recipient.name}
                    <button 
                      onClick={() => removeSelectedRecipient(recipient.id)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Message Type Toggle */}
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="messageType"
                checked={messageType === "template"}
                onChange={() => setMessageType("template")}
              />
              <span className="ml-2">Template Message</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="messageType"
                checked={messageType === "custom"}
                onChange={() => setMessageType("custom")}
              />
              <span className="ml-2">Custom Message</span>
            </label>
          </div>
          
          {/* Template Message Section */}
          {messageType === "template" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2">
                <InputWrapper
                  label={"Select Message Template"}
                  labelFor="message_template"
                >
                  <SearchableSelect
                    key={`searchable-select-${searchableSelectKey}`}
                    label={"Message Templates"}
                    labelFor="message_template"
                    value={selectedMessage}
                    onValueChange={handleTemplateSelect}
                    options={messageTemplate?.data ?? []}
                    loading={messageLoading}
                    labelKey="customMessage" 
                    valueKey="customMessage" 
                    placeholder="Select a template please"
                  />
                </InputWrapper>
              </div>
            </div>
          )}
          
          {/* Custom Message Section */}
          {messageType === "custom" && (
            <div className="mt-2">
              <label htmlFor="custom-message" className="block text-sm font-medium text-gray-700 mb-1">
                Compose your message
              </label>
              <textarea
                id="custom-message"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your custom message here..."
                value={customMessage}
                onChange={handleCustomMessageChange}
                maxLength={500}
              />
              <p className="mt-1 text-sm text-gray-500">
                {customMessage.length}/500 characters
              </p>
            </div>
          )}
          
          {/* Send Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSendMessage}
              disabled={
                (messageType === "template" && !selectedMessage) || 
                (messageType === "custom" && !customMessage) || 
                selectedRows.length === 0 || 
                isSending
              }
              className={`px-4 py-2 rounded-md text-white ${
                ((messageType === "template" && !selectedMessage) || 
                 (messageType === "custom" && !customMessage) || 
                 selectedRows.length === 0 || 
                 isSending)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search customers..."
              className="border rounded pl-10 pr-3 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          {isError ? (
            <p className="p-4 text-red-500">Error loading customer data</p>
          ) : (
            <>
              <Table
                headers={headers}
                data={data?.data}
                selectedRows={selectedRows}
                onRowSelect={toggleRowSelection}
                onSelectAll={toggleSelectAll}
                renderRow={(row: any, index: number) => {
                  const dynamicIndex =
                    index + 1 + (pagination.page - 1) * pagination.size;
                  return (
                    <>
                      <td className="px-4 py-2 font-medium">{dynamicIndex}</td>
                      <td className="px-4 flex items-center gap-2 py-2 font-medium">
                        <img
                          src={row.avatar}
                          alt={row.name}
                          className="w-8 h-8 rounded-full"
                        />
                        {row.name}
                      </td>
                      <td className="px-4 py-2">{row.email || "N/A"}</td>
                      <td className="px-4 py-2">{row.contactNo}</td>
                    </>
                  );
                }}
              />

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  totalPages={pagination.meta.totalPage || 1}
                  currentPage={pagination.page}
                  itemsPerPage={pagination.size}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default SendMessage;