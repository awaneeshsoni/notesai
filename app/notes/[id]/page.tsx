'use client';

import { useState, useEffect } from 'react';
import { Note } from 'types';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, TrashIcon, LightBulbIcon } from '@heroicons/react/24/solid';
import { summarizeNote } from '@/lib/gemini';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { RotateCw } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, { 
    message: "Title must be at least 1 characters.",
  }),
  content: z.string().min(1, { 
    message: "Content must be at least 1 characters.",
  }),
})

async function getNote(id: string): Promise<Note | null> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching note:", error);
    return null;
  }

  return data as Note;
}

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const { id } = useParams();
  const [isNew, setIsNew] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
    const [userId, setUserId] = useState<string | null>(null); 
    const [isSessionLoading, setIsSessionLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            setIsSessionLoading(true);
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error("Error getting session:", error);
                    router.push('/login'); 
                    return;
                }

                if (!session?.user?.id) {
                    router.push('/login'); 
                    return;
                }

                setUserId(session.user.id); 
            } finally {
                setIsSessionLoading(false); 
            }
        };

        fetchSession();
    }, [router]); 

  useEffect(() => {
    setIsNew(id === 'new');
  }, [id]);

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => getNote(id),
    enabled: !isNew && id !== 'new' && !isSessionLoading && userId !== null, // Ensure session is loaded and userId is available
    onSuccess: (data: { content: any; }) => {
      setCurrentContent(data?.content || '');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
    },
    mode: "onChange",
  })

  useEffect(() => {
      form.reset({ title: note?.title || '', content: note?.content || '' });
  }, [note, form.reset]);

  useEffect(() => {
      setCurrentContent(form.getValues("content"))
  },[form.watch("content")])

  const handleDelete = async () => {
    if (note) {
      const confirmDelete = window.confirm("Are you sure you want to delete this note?");
      if (confirmDelete) {
        setIsDeleting(true);
        try {
          const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', note.id);

          if (error) {
            console.error("Error deleting note:", error);
          } else {
            queryClient.invalidateQueries(['notes']);
            router.push('/notes');
          }
        } finally {
          setIsDeleting(false);
        }
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    const isNewNote = !note;

    try {
      if (isNewNote) {
        if (!userId) {
          console.error("User ID is not available.");
          setErrorMessage("User ID is not available. Please refresh the page or log in again.");
          return;
        }

        const { data, error } = await supabase
          .from('notes')
          .insert([{
            title: values.title,
            content: values.content,
            user_id: userId,
          }])
          .select()

        if (error) {
          console.error("Error creating note:", error);
          setErrorMessage(`Error creating note: ${error.message}`);

        } else {
          queryClient.invalidateQueries(['notes']);
          router.push('/notes');
          setSuccessMessage("Note created successfully!");
        }
      } else {
        const { data, error } = await supabase
          .from('notes')
          .update({ title: values.title, content: values.content })
          .eq('id', note.id)
          .select()

        if (error) {
          console.error("Error updating note:", error);
          setErrorMessage(`Error updating note: ${error.message}`);

        } else {
          queryClient.invalidateQueries(['notes']);
          queryClient.invalidateQueries(['note', note.id]);
          router.push('/notes');
          setSuccessMessage("Note updated successfully!");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

    const handleSummarize = async () => {
        setIsSummarizing(true);
        try {
            const generatedSummary = await summarizeNote(currentContent);
            setSummary(generatedSummary);
        } catch (error) {
            console.error("Error during summarization:", error);
            setSummary("Error generating summary.");
        } finally {
            setIsSummarizing(false);
        }
    };

    if (isSessionLoading) {
        return (
            <div className="container mx-auto py-10">
                <div>Loading session...</div>
            </div>
        );
    }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div>Loading note...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <div>Error loading note.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-10">
      <div className="flex justify-between items-center mb-3.5">
        <Button variant="secondary" onClick={() => router.push('/notes')}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="mr-2"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              Deleting... <RotateCw className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </>
          )}
        </Button>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="My Awesome Note" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your note here..."
                    className="resize-none min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {summary && (
            <div className="mt-4 p-4 border rounded-md bg-gray-100">
              <h3 className="font-bold">Summary:</h3>
              <p>{summary}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  Submitting... <RotateCw className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Submit"
              )}
            </Button>
              <Button
                onClick={handleSummarize}
                disabled={isSummarizing}
              >
                {isSummarizing ? (
                  <>
                    Summarizing... <RotateCw className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <LightBulbIcon className="h-4 w-4 mr-2" />
                    Summarize
                  </>
                )}
              </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}