/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useActionState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {
  const [error, setError] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch: formData.get("pitch") as string,
      };

      await formSchema.parseAsync(formValues);
      console.log(formValues);
      const result = await createPitch(prevState, formData, formValues.pitch)
        if(result.status === 'SUCCESS') {
          toast({
            title: "Success",
            variant: "default",
            description: "Your idea has been submitted successfully",
          });
          router.push(`/startup/${result._id}`)
      }

      return result
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setError(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Error",
          variant: "destructive",
          description: "Invalid form data",
        });

        return { ...prevState, status: "ERROR", error: "Invalid form data" };
      }

      toast({
        title: "Error",
        variant: "destructive",
        description: "Unexpected error occured",
      });
      return {
        ...prevState,
        status: "ERROR",
        error: "Unexpected error occured",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />
        {error.title && <p className="startup-form_error">{error.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />
        {error.description && (
          <p className="startup-form_error">{error.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category"
        />
        {error.category && (
          <p className="startup-form_error">{error.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="title" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />
        {error.link && <p className="startup-form_error">{error.link}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          Pitch
        </label>
        <Textarea
          id="pitch"
          name="pitch"
          className="startup-form_textarea"
          required
          placeholder="Pitch"
        />
        {error.pitch && <p className="startup-form_error">{error.pitch}</p>}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="startup-form_btn text-white"
      >
        {isPending ? "Submitting..." : "Submit your pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
