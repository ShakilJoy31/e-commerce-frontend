import { fallback } from "@/utils/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const whatsAppApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD WhatsApp Contact
    addWhatsApp: builder.mutation({
      query: (data) => ({
        url: "/whatsapp/create-whatsapp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["whatsapp"],
    }),

    // GET ALL WhatsApp Contacts
    getWhatsAppContacts: builder.query({
      query: (data) => ({
        url: `/whatsapp/get-whatsapp-all?page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&search=${data.search || ""}&sortOrder=${data?.sort || "asc"}`,
      }),
      providesTags: ["whatsapp"],
    }),

    // GET SINGLE WhatsApp Contact
    getSingleWhatsApp: builder.query({
      query: (id) => ({
        url: `/whatsapp/get-whatsapp-by-id/${id}`,
      }),
      providesTags: ["whatsapp"],
    }),

    // UPDATE WhatsApp Contact
    updateWhatsApp: builder.mutation({
      query: ({ id, data }) => ({
        url: `/whatsapp/update-whatsapp/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["whatsapp"],
    }),

    // DELETE WhatsApp Contact
    deleteWhatsApp: builder.mutation({
      query: (id) => ({
        url: `/whatsapp/delete-whatsapp/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["whatsapp"],
    }),
  }),
});

export const { 
  useAddWhatsAppMutation, 
  useDeleteWhatsAppMutation, 
  useGetSingleWhatsAppQuery, 
  useGetWhatsAppContactsQuery, 
  useUpdateWhatsAppMutation 
} = whatsAppApi;
