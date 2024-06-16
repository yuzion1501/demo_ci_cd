/*
{
  "job_id": "123e4567-e89b-12d3-a456-426614174000",
  "employer_id": "123e4567-e89b-12d3-a456-426614174000",
  "job_salary": 100000,
  "job_title": "Software Engineer",
  "job_location": "New York",
  "job_type": "Full-time",
  "post_at": "2021-09-01T00:00:00Z",
  "job_skills": "Java, Python, C++",
  "job_top_reasons": "Good salary, Good benefits, Good work-life balance",
  "job_description": "We are looking for a software engineer to join our team. You will be responsible for developing software applications and maintaining existing software applications. You will work with a team of software engineers to develop software applications that meet the needs of our customers. You will also work with other departments to ensure that software applications meet the needs of the business. You will be responsible for writing code, testing code, and debugging code. You will also be responsible for documenting code and providing support to other software engineers. You will work with other departments to ensure that software applications meet the needs of the business. You will be responsible for writing code, testing code, and debugging code. You will also be responsible for documenting code and providing support to other software engineers.",
  "job_responsibility": "Develop software applications, Maintain existing software applications, Work with a team of software engineers, Develop software applications that meet the needs of our customers, Work with other departments to ensure that software applications meet the needs of the business, Write code, Test code, Debug code, Document code, Provide support to other software engineers",
  "job_requirements": "Bachelor's degree in computer science or related field, 3 years of experience in software development, Proficient in Java, Python, C++, Strong problem-solving skills, Strong communication skills, Ability to work in a team environment, Ability to work independently, Ability to work under pressure",
  "job_benefits": "Competitive salary, Health insurance, Dental insurance, Vision insurance, 401(k) plan, Paid time off, Flexible work schedule, Remote work option",
}
 */
// Components
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/authContext";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast } from "react-toastify";

const JobPost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {currentUser} = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [jobResponsibility, setJobResponsibility] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");

  const onSubmit = (data) => {
    data.jobDescription = jobDescription;
    data.jobResponsibility = jobResponsibility;
    data.jobRequirement = jobRequirements;
    console.log(data);
    postJob(data);
  };

  const postJob = async (data) => {
    try {
      const response = await fetch(
      "https://employer-service-otwul2bnna-uc.a.run.app/employer/post-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: currentUser?.accessToken,
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        toast.success("Job posted successfully");
      } else {
        toast.error("Failed to post job");
      }
    } catch (error) {
      toast.error("Error: ", error);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="space-y-6">
          <div className="relative mb-6">
            <input
              type="text"
              id="job_title"
              {...register("jobTitle", { required: true })}
              className="peer block w-full border border-gray-300 rounded-lg px-3 pt-6 pb-2 focus:outline-[4px] focus:outline-green-200 focus:outline focus:outline-solid"
              placeholder=" "
            />
            <label
              htmlFor="job_title"
              className="absolute top-0 left-3 px-1 my-2 text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-3 peer-focus:top-0 peer-focus:left-3 text-sm"
            >
              Job Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            {errors.jobTitle && (
              <span className="px-3 text-red-600">This field is required</span>
            )}
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              id="job_location"
              {...register("jobLocation", { required: true })}
              className="peer block w-full border border-gray-300 rounded-lg px-3 pt-6 pb-2 focus:outline-[4px]  focus:outline-green-200 focus:outline focus:outline-solid"
              placeholder=" "
            />
            <label
              htmlFor="job_location"
              className="absolute top-0 left-3 px-1 my-2 text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-3 peer-focus:top-0 peer-focus:left-3  text-sm"
            >
              Job Location
              <span className="text-red-500 ml-1">*</span>
            </label>
            {errors.jobLocation && (
              <span className="px-3 text-red-600">This field is required</span>
            )}
          </div>
          <div className="relative mb-6">
            <input
              type="text"
              id="job_type"
              {...register("jobType", { required: true })}
              className="peer block w-full border border-gray-300 rounded-lg px-3 pt-6 pb-2 focus:outline-[4px]  focus:outline-green-200 focus:outline focus:outline-solid"
              placeholder=" "
            />
            <label
              htmlFor="job_type"
              className="absolute top-0 left-3 px-1 my-2 text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-3 peer-focus:top-0 peer-focus:left-3  text-sm"
            >
              Job Type
              <span className="text-red-500 ml-1">*</span>
            </label>
            {errors.jobType && (
              <span className="px-3 text-red-600">This field is required</span>
            )}
          </div>
          <div className="relative mb-6">
            <input
              type="text"
              id="job_salary"
              {...register("jobSalary", { required: true })}
              className="peer block w-full border border-gray-300 rounded-lg px-3 pt-6 pb-2 focus:outline-[4px]  focus:outline-green-200 focus:outline focus:outline-solid"
              placeholder=" "
            />
            <label
              htmlFor="job_salary"
              className="absolute top-0 left-3 px-1 my-2 text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-3 peer-focus:top-0 peer-focus:left-3  text-sm"
            >
              Job Salary
              <span className="text-red-500 ml-1">*</span>
            </label>
            {errors.jobSalary && (
              <span className="px-3 text-red-600">This field is required</span>
            )}
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              id="job_skills"
              {...register("jobSkills", { required: true })}
              className="peer block w-full border border-gray-300 rounded-lg px-3 pt-6 pb-2 focus:outline-[4px]  focus:outline-green-200 focus:outline focus:outline-solid"
              placeholder=" "
            />
            <label
              htmlFor="job_skills"
              className="absolute top-0 left-3 px-1 my-2 text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-3 peer-focus:top-0 peer-focus:left-3  text-sm"
            >
              Job Skills
              <span className="text-red-500 ml-1">*</span>
            </label>
            {errors.jobSkills && (
              <span className="px-3 text-red-600">This field is required</span>
            )}
          </div>

          <div className="relative mb-6">
            <textarea

              rows={3}
              type="text"
              id="job_top_reasons"
              {...register("jobTopReasons", { required: true })}
              className="peer block w-full border border-gray-300 rounded-lg px-3 pt-6 pb-2 focus:outline-[4px]  focus:outline-green-200 focus:outline focus:outline-solid whitespace-pre-wrap"
              placeholder=" "
            />
            <label
              htmlFor="job_top_reasons"
              className="absolute top-0 left-3 px-1 my-2 text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-3 peer-focus:top-0 peer-focus:left-3  text-sm"
            >
              Job Top Reasons
              <span className="text-red-500 ml-1">*</span>
            </label>
            {errors.jobTopReasons && (
              <span className="px-3 text-red-600">This field is required</span>
            )}
          </div>

          <div className="relative mb-6">
            <textarea
              rows={5}
              type="text"
              id="job_benefits"
              {...register("jobBenefit", { required: true })}
              className="whitespace-pre-wrap peer block w-full border border-gray-300 rounded-lg px-3 pt-6 pb-2 focus:outline-[4px] focus:outline-green-200 focus:outline focus:outline-solid"
              placeholder=" "
            />
            <label
              htmlFor="job_benefits"
              className="absolute top-0 left-3 px-1 my-2 text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-3 peer-focus:top-0 peer-focus:left-3 text-sm"
            >
              Job Benefits
              <span className="text-red-500 ml-1">*</span>
            </label>
            {errors.jobBenefit && (
              <span className="px-3 text-red-600">This field is required</span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="job_description" className="block mb-2 font-medium">
              Job Description
            </label>
            <CKEditor
              onReady={(editor) => {
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "8rem",
                    editor.editing.view.document.getRoot()
                  );
                });
              }}
              editor={ClassicEditor}
              data=""
              onChange={(event, editor) => {
                setJobDescription(editor.getData());
              }}
              className="border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label
              htmlFor="job_responsibility"
              className="block mb-2 font-medium"
            >
              Job Responsibility
            </label>
            <CKEditor
              onReady={(editor) => {
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "8rem",
                    editor.editing.view.document.getRoot()
                  );
                });
              }}
              editor={ClassicEditor}
              data=""
              onChange={(event, editor) => {
                setJobResponsibility(editor.getData());
              }}
              className="border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label
              htmlFor="job_requirements"
              className="block mb-2 font-medium"
            >
              Job Requirements
            </label>
            <CKEditor
              onReady={(editor) => {
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "8rem",
                    editor.editing.view.document.getRoot()
                  );
                });
              }}
              editor={ClassicEditor}
              data=""
              onChange={(event, editor) => {
                setJobRequirements(editor.getData());
              }}
              className="border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <button
          type="submit"
          className="col-span-2 mt-4 bg-[#ED1B2F] hover:bg-red-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default JobPost;
