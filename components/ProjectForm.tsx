"use client"
import React, { ChangeEvent } from 'react';
import { FormState, ProjectInterface, SessionInterface } from '@/common.type';
import Image from 'next/image';
import FormField from './FormField';
import { categoryFilters } from '@/constants';
import CustomMenu from './CustomMenu';
import { useState } from 'react';
import { read } from 'fs';
import Button from './Button';
import { createNewProject, fetchToken, updateProject } from '@/lib/actions';
import { useRouter } from 'next/navigation';
type Props = { 
  type: string , 
  session : SessionInterface;
  project?: ProjectInterface
}


const ProjectForm = ({type , session , project} : Props) => {
  const router = useRouter();
  const handleFormSubmit = async  (e: React.FormEvent) => {
    e.preventDefault();
    setisSubmitting(true);

    const {token}  =  await fetchToken();

    try {
      if(type === 'create'){
        await createNewProject(form , session?.user?.id , token);
        router.push('/')
      }
      if(type === 'edit') {
        await updateProject(form , project?.id  as string, token)
            router.push('/')
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisSubmitting(false);
    }

  };
  const handleChangeImage = (e : ChangeEvent<HTMLInputElement>) => {

    e.preventDefault();
    const file = e.target.files?.[0];
    if(!file) return;
    if(!file.type.includes('image')) {
      return alert('Please upload an image file')
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result  = reader.result as string;
      handleStateChange('image' , result);
    }
  };


  const handleStateChange = (fieldName: string , value : string) => {

    setForm((prevState) => (
      {
        ...prevState , [fieldName]: value
      }
    ))
  };

  const [isSubmitting, setisSubmitting] = useState(false)
  const [form, setForm] = useState<FormState>({
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    liveSiteUrl: project?.liveSiteUrl || "",
    githubUrl: project?.githubUrl || "",
    category: project?.category || ""
})
  
  return (
    <form
    onSubmit= {handleFormSubmit}
    className="flexStart form"
    >
      <div className='flexStart form_image-container'>
        <label htmlFor='poster' className='flexCenter form_image-label'>{!form.image && 'Choose a poster for your project'}</label>
        <input  id="image" type = "file" accept='image/*' required={type === 'create'}
         className="form_image-input" onChange={handleChangeImage}/>
         {form.image && (
          <Image src={form.image} className="sm:p-10 object-contain z-20"  alt='Project Poster' fill/>
         )}
      </div>
      <FormField 
      title = "Title"
      state = {form.title}
      placeholder = "Flexibble"
      setState = {(value) => handleStateChange('title' , value)}
      
      />
      <FormField 
      title = "Description"
      state = {form.description}
      placeholder = "Showcase and discover remarkable developer projects"
      setState = {(value) => handleStateChange('description' , value)}
      
      />
      <FormField 
      title = "Website Url"
      state = {form.liveSiteUrl}
      placeholder = "https://fitras.store"
      setState = {(value) => handleStateChange('liveSiteUrl' , value)}
      
      />
      <FormField 
      type='url'
      title = "Github Url"
      state = {form.githubUrl}
      placeholder = "https://github.com/shoaib-A"
      setState = {(value) => handleStateChange('githubUrl' , value)}
      
      />
       <CustomMenu 
       title = "Category"
       state = {form.category}
       filters = {categoryFilters}
       setState = {(value) => handleStateChange('category' , value)}
       />
      <div className="flexStart w-full">
        <Button 
        title={isSubmitting ? `${type === "create" ? "Creating" : "Editing"}` : `${type === "create" ? "Create" : "Edit"}`}
        type="submit"
        leftIcon = {isSubmitting ? "" : '/plus.svg'} 
        isSubmitting = {isSubmitting} 
         />

      </div>
    </form>
  )
}

export default ProjectForm