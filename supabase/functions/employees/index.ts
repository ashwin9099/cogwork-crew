import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Employee {
  id?: string;
  employee_id: string;
  name: string;
  email: string;
  position: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const url = new URL(req.url);
    const method = req.method;
    
    // For supabase.functions.invoke, the employee ID comes in the request body or URL params
    let employeeId: string | null = null;
    let requestBody: any = null;

    // Try to parse request body if it exists
    if (req.body && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
      try {
        requestBody = await req.json();
        // For PUT and DELETE, check if ID is in the body
        if (method === 'PUT' || method === 'DELETE') {
          employeeId = requestBody?.id || url.searchParams.get('id');
        }
      } catch {
        // If parsing fails, try to get from URL params
        employeeId = url.searchParams.get('id');
      }
    }

    console.log(`${method} request to ${url.pathname}, employeeId: ${employeeId}`);

    switch (method) {
      case 'GET': {
        if (employeeId) {
          // Get single employee
          const { data, error } = await supabaseClient
            .from('employees')
            .select('*')
            .eq('id', employeeId)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all employees
          const { data, error } = await supabaseClient
            .from('employees')
            .select('*')
            .order('created_at', { ascending: true });

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      case 'POST': {
        const employee: Employee = requestBody || await req.json();
        
        console.log('Creating employee:', employee);

        const { data, error } = await supabaseClient
          .from('employees')
          .insert([employee])
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'PUT': {
        if (!employeeId) {
          return new Response(JSON.stringify({ error: 'Employee ID is required for update' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Remove id from the update data to avoid conflicts
        const { id, ...employee } = requestBody || {};
        
        console.log('Updating employee:', employeeId, employee);

        const { data, error } = await supabaseClient
          .from('employees')
          .update(employee)
          .eq('id', employeeId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'DELETE': {
        if (!employeeId) {
          return new Response(JSON.stringify({ error: 'Employee ID is required for delete' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('Deleting employee:', employeeId);

        const { error } = await supabaseClient
          .from('employees')
          .delete()
          .eq('id', employeeId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});