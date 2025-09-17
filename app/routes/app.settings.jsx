import { json } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Button, TextField, Page, Layout, Card, FormLayout, Toast } from '@shopify/polaris';
import { Form, useActionData } from '@remix-run/react';


import db from "../db.server";

export async function loader() {
  let settings = await db.settings.findFirst();
  console.log("settingsssss----", settings);
  return json(settings);
}


export async function action({request}) {
  let settings = await request.formData();
  settings = Object.fromEntries(settings);

  await db.settings.upsert({
    where: {
      id: 1
    },
    update: {
      id: 1,
      name: settings.name,
      description: settings.description
    },
    create: {
      id: 1,
      name: settings.name,
      description: settings.description
    }
  })
  return json(settings);
}

export default function SettingsForm() {
  const actionData = useActionData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleNameChange = (value) => setName(value);
  const handleDescriptionChange = (value) => setDescription(value);

  useEffect(() => {
    if (actionData?.success) {
      setShowToast(true);
    }
  }, [actionData?.success]);

  return (
    <Page title="Create Settings">
      <Layout>
        <Layout.Section>
          <Card title="Settings Form" sectioned>
            <Form method="post">
              <FormLayout>
                <TextField
                  label="Name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  error={actionData?.error && !name ? actionData.error : undefined}
                />
                <TextField
                  label="Description"
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
                />
                <Button submit>Submit</Button>
              </FormLayout>
            </Form>

            {showToast && (
              <Toast
                content={actionData.success}
                onDismiss={() => setShowToast(false)}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
