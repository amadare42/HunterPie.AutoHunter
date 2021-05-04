using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ClearScript;
using Namotion.Reflection;

namespace AutoHunter.TypesGenerator
{
    public class TypingsGenerator
    {
        public Context Context { get; set; } = new Context();

        public void IgnoreType(Type type)
        {
            Context.SkipTypes.Add(type);
        }

        public void AddBaseTypes()
        {
            // collections
            this.Context.Types.Add("Dictionary<Key, Value>", @"any");
            this.Context.Types.Add("ReadOnlyDictionary<Key, Value>", @"Dictionary<Key, Value>");
            this.Context.Types.Add("IReadOnlyCollection<Value>", @"Iterable<Value> & { readonly [n: number]: Value }");
            this.Context.Types.Add("List<Value>", @"Iterable<Value> & { readonly [n: number]: Value, Count: number }");
            this.Context.Types.Add("ClrArray<Value>", @"Iterable<Value> & { readonly [n: number]: Value, Length: number }");
            this.Context.Types.Add("IEnumerable<Value>", @"Iterable<Value> & { readonly [n: number]: Value }");
            
            // system types
            this.Context.Types.Add("Enum<Value extends string>", @"{ ToString(): Value }");

            // Clearscript's event mechanism
            this.Context.Types.Add("EventObj<Args>", @"{ connect(cb: (sender: any, args: Args) => void): EventConnection;  }");
            this.Context.Types.Add("EventConnection", @"{ disconnect(): void; }");

            // Plugin's event mechanism
            this.Context.Types.Add("EventArgs", @"any");
            this.Context.Types.Add("EventRegistration", @"{ unregister(): void; }");
        }

        public string GenerateText()
        {
            var sb = new StringBuilder();

            sb.AppendLine("// ---- Types ---");
            foreach (var kv in this.Context.Types)
            {
                sb.AppendLine($"declare type {kv.Key} = {kv.Value};");
                sb.AppendLine();
            }

            sb.AppendLine();
            
            sb.AppendLine("// --- Events ---");
            sb.AppendLine("declare type Events = {");
            foreach (var kv in this.Context.Events)
            {
                sb.AppendLine($"    '{kv.Key}': {kv.Value},");
            }
            sb.AppendLine("};");
            sb.AppendLine();
            
            sb.AppendLine("// ---- Host objects ---");
            foreach (var kv in this.Context.Consts)
            {
                sb.AppendLine($"declare const {kv.Key}: {kv.Value};");
            }
            sb.AppendLine();

            return sb.ToString();
        }

        public void AddEvents(Type type, string path)
        {
            var subPath = string.IsNullOrEmpty(path) ? "" : $"{path}.";
            
            var eventInfos = type.GetEvents(BindingFlags.Public | BindingFlags.Instance);
            foreach (var eventInfo in eventInfos)
            {
                var newPath = subPath + eventInfo.Name;
                this.Context.Events.Add(newPath, GetArgs(eventInfo, newPath));
            }
            
            var properties = type.GetProperties(BindingFlags.Instance | BindingFlags.Public);
            foreach (var property in properties)
            {
                if (property.PropertyType.FullName.StartsWith("System.")) continue;
                AddEvents(property.PropertyType, subPath + property.Name);
            }
        }

        public string GetArgs(EventInfo eventInfo, string path)
        {
            try
            {
                var argsType = eventInfo.EventHandlerType.GetMethod("Invoke").GetParameters()[1];
                var typeName = AddType(argsType.ParameterType);
                return typeName;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"{path}:: {ex.Message}");
                return "any";
            }
        }

        public void AddConst(string name, Type type)
        {
            this.Context.Consts.Add(name, AddType(type));
        }

        public void AddStaticType(string name, Type type)
        {
            AddComplexType(type, GetTypeName(type), BindingFlags.Public | BindingFlags.Static);
            AddConst(name, type);
        }

        string GetTypeName(Type type)
        {
            return type.Name + "Type";
        }
        

        public string AddType(Type clrType)
        {
            var typeName = GetTypeName(clrType);
            
            var nullableType = Nullable.GetUnderlyingType(clrType);
            if (nullableType != null)
            {
                return $"{AddType(nullableType)} | null";
            }
            
            if (clrType == typeof(int) || clrType == typeof(double) || clrType == typeof(uint) || clrType == typeof(short) || clrType == typeof(byte) || clrType == typeof(float))
            {
                return "number";
            }

            if (clrType == typeof(bool))
            {
                return "boolean";
            }

            if (clrType == typeof(string))
            {
                return "string";
            }

            if (clrType == typeof(void))
            {
                return "void";
            }

            if (clrType.IsEnum)
            {
                if (!Context.Types.ContainsKey(typeName))
                {
                    var vals = string.Join(" | ", clrType.GetEnumNames().Select(n => $"\"{n}\""));
                    Context.Types.Add(typeName, $"Enum<{vals}>");
                }
                
                return typeName;
            }

            if (typeof(Task).IsAssignableFrom(clrType))
            {
                var returnType = clrType.GetGenericArguments().FirstOrDefault();
                if (returnType == null)
                {
                    return "Promise<void>";
                }

                return $"Promise<{AddType(returnType)}>";
            }

            if (IsAssignableToGenericType(clrType, typeof(List<>)))
            {
                return $"List<{AddType(clrType.GetGenericArguments()[0])}>";
            }
            
            if (typeof(Array).IsAssignableFrom(clrType))
            {
                return $"ClrArray<{AddType(clrType.GetElementType())}>";
            }

            if (IsAssignableToGenericType(clrType, typeof(Dictionary<,>)))
            {
                var args = clrType.GenericTypeArguments;
                return $"Dictionary<{AddType(args[0])}, {AddType(args[1])}>";
            }
            
            if (IsAssignableToGenericType(clrType, typeof(IReadOnlyDictionary<,>)))
            {
                var args = clrType.GenericTypeArguments;
                return $"ReadOnlyDictionary<{AddType(args[0])}, {AddType(args[1])}>";
            }
            
            if (IsAssignableToGenericType(clrType, typeof(IReadOnlyCollection<>)))
            {
                var args = clrType.GenericTypeArguments;
                return $"IReadOnlyCollection<{AddType(args[0])}>";
            }
            
            // TODO: remove hardcode for Clearscript
            if (IsAssignableToGenericType(clrType, typeof(IEnumerable<>)) && !typeof(IPropertyBag).IsAssignableFrom(clrType))
            {
                return $"IEnumerable<{AddType(clrType.GetGenericArguments()[0])}>";
            }

            if (clrType == typeof(EventArgs))
            {
                return "EventArgs";
            }

            if (clrType.IsGenericParameter)
            {
                return $"any /* generic: {clrType.Name} */";
            }

            if (string.IsNullOrEmpty(clrType.FullName))
            {
                return $"any /* no full name: {clrType.Name} */";
            }

            if (clrType.FullName.StartsWith("System."))
            {
                return $"any /* {clrType.Name} */";
            }

            if (typeof(Delegate).IsAssignableFrom(clrType))
            {
                return $"any /* delegate */";
            }

            AddComplexType(clrType, typeName);

            return typeName;
        }

        private void AddComplexType(Type clrType, string typeName, BindingFlags flags = BindingFlags.Instance | BindingFlags.Public)
        {
            if (!this.Context.Types.ContainsKey(typeName))
            {
                var properties = clrType.GetProperties(flags);
                var fields = clrType.GetFields(flags);
                var methods = clrType.GetMethods(flags).Where(m =>
                {
                    if (typeof(object)
                        .GetMethods()
                        .Select(me => me.Name)
                        .Contains(m.Name)) return false;
                    if (m.IsSpecialName) return false;
                    return true;
                }).ToArray();
                var events = clrType.GetEvents(flags);

                if ((properties.Any() || fields.Any() || methods.Any() || events.Any()) &&
                    !clrType.FullName.StartsWith("System."))
                {
                    var sb = new StringBuilder("{\n");
                    this.Context.Types.Add(typeName, "");

                    foreach (var property in properties)
                    {
                        var summary = property.GetXmlDocsSummary();
                        if (!string.IsNullOrEmpty(summary))
                        {
                            sb.AppendLine($"    // {summary.Trim('\n').Replace("\n", "\n    // ")}");
                        }

                        sb.AppendLine($"    {property.Name}: {AddType(property.PropertyType)},");
                    }

                    foreach (var field in fields)
                    {
                        var summary = field.GetXmlDocsSummary();
                        if (!string.IsNullOrEmpty(summary))
                        {
                            sb.AppendLine($"    // {summary.Trim('\n').Replace("\n", "\n    // ")}");
                        }

                        sb.AppendLine($"    {field.Name}: {AddType(field.FieldType)},");
                    }


                    foreach (var method in methods)
                    {
                        var summary = method.GetXmlDocsSummary();
                        if (!string.IsNullOrEmpty(summary))
                        {
                            sb.AppendLine($"    // {summary.Trim('\n').Replace("\n", "\n    // ")}");
                        }

                        var parameters = string.Join(", ", method.GetParameters()
                            .Select(p => $"{p.Name}: {(p.ParameterType.IsGenericParameter ? $"any /* generic: {p.ParameterType.Name} */" : AddType(p.ParameterType))}")
                        );
                        sb.AppendLine($"    {method.Name}({parameters}): {AddType(method.ReturnType)},");
                    }

                    foreach (var eventInfo in events)
                    {
                        var summary = eventInfo.GetXmlDocsSummary();
                        if (!string.IsNullOrEmpty(summary))
                        {
                            sb.AppendLine($"    // {summary.Trim('\n').Replace("\n", "\n    // ")}");
                        }

                        sb.AppendLine($"    {eventInfo.Name}: EventObj<{GetArgs(eventInfo, eventInfo.Name)}>,");
                    }

                    sb.Append("}");

                    this.Context.Types[typeName] = sb.ToString();
                }
                else
                {
                    this.Context.Types.Add(typeName, $"any /* {clrType.FullName} */");
                }
            }
        }

        public static bool IsAssignableToGenericType(Type givenType, Type genericType)
        {
            var interfaceTypes = givenType.GetInterfaces();

            foreach (var it in interfaceTypes)
            {
                if (it.IsGenericType && it.GetGenericTypeDefinition() == genericType)
                    return true;
            }

            if (givenType.IsGenericType && givenType.GetGenericTypeDefinition() == genericType)
                return true;

            Type baseType = givenType.BaseType;
            if (baseType == null) return false;

            return IsAssignableToGenericType(baseType, genericType);
        }
        
    }
}