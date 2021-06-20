import React, { Component } from 'react';
import { render } from 'react-dom';
import { useTypedController } from '@hookform/strictly-typed';
import { useForm, useFormContext, FormProvider, Control } from 'react-hook-form';
import { TextField, Checkbox } from '@material-ui/core';

import './style.css';
import { DeepPath, DeepPathValue, FieldValuesFromControl, UnpackNestedValue } from '@hookform/strictly-typed/dist/types';

interface FormValues {
  flat: string;
  count: number;
  letters: {
    a: string,
    b: number
  }
  nested: {
    object: { test: string };
    array: { test: boolean }[];
  };
};

const TypedFormInput = createTypedInput<FormValues>()

function App() {
  const form = useForm<FormValues>();
  const TypedController = useTypedController<FormValues>({ control: form.control });

  const onSubmit = form.handleSubmit((data) => console.log(data));

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        {/* 
          MY NESTED EXAMPLES
        */}
        <TypedFormInput 
          name={"flat"} 
          defaultValue={"flat input"} 
        />
        <TypedFormInput
          name={["letters", "a"]} 
          defaultValue={"A"}
        />

        <TypedFormInput
          name={["letters", "b"]} 
          defaultValue={2} 
        />
        
        {/* ❌: Type 'number' is not assignable to type 'string' */}
        <TypedFormInput
          name={"flat"} 
          defaultValue={1} 
        />

        {/* ❌: Type 'string' is not assignable to type 'number'. */}
        <TypedFormInput
          name={["letters", "b"]} 
          defaultValue={"B"} 
        />
        
        {/* ❌: Type '"c"' is not assignable to type '"a" | "b"'. */}
        <TypedFormInput
          name={["letters", "c"]} 
          defaultValue={1} 
        />


        {/* * ************** */}
        {/* NON NESTED EXAMPLES from https://github.com/react-hook-form/strictly-typed: */}

        <TypedController
          name="flat"
          defaultValue=""
          render={(props) => <TextField {...props} />}
        />

        <TypedController
          as="textarea"
          name={['nested', 'object', 'test']}
          defaultValue=""
          rules={{ required: true }}
        />

        <TypedController
          name={['nested', 'array', 0, 'test']}
          defaultValue={false}
          render={(props) => <Checkbox {...props} />}
        />

        {/* ❌: Type '"notExists"' is not assignable to type 'DeepPath<FormValues, "notExists">'. */}
        <TypedController as="input" name="notExists" defaultValue="" />

        {/* ❌: Type 'number' is not assignable to type 'string | undefined'. */}
        <TypedController
          as="input"
          name={['nested', 'object', 0, 'notExists']}
          defaultValue=""
        />

        {/* ❌: Type 'true' is not assignable to type 'string | undefined'. */}
        <TypedController as="input" name="flat" defaultValue={true} />

        <input type="submit" />
      </form>
    </FormProvider>
  );
}


interface NestedInputProps<
  FormType extends UnpackNestedValue<FieldValuesFromControl<Control>>, 
  Path extends DeepPath<FormType, Path>, 
> {
  name: Path;
  defaultValue: DeepPathValue<FormType, Path>
}

function createTypedInput<FormType extends Record<string, any>>() {
  return <Path extends DeepPath<FormType, Path>>(props: NestedInputProps<FormType, Path>) => {
    return <NestedInput {...props} />
  }
}

function NestedInput<
  FormType extends UnpackNestedValue<FieldValuesFromControl<Control>>, 
  Path extends DeepPath<FormType, Path>, 
>(
  props: NestedInputProps<FormType, Path>
) {
  const { control, handleSubmit } = useFormContext<FormType>();
  const TypedController = useTypedController<FormType>({ control });

  return (
    <TypedController
      name={props.name}
      defaultValue={props.defaultValue}
      as={'input'}
    />
  )
}


render(<App />, document.getElementById('root'));
