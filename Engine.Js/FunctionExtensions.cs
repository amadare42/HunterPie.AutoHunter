using System;
using System.Threading;
using System.Threading.Tasks;

namespace Engine.Js
{
    public static class FunctionExtensions
    {
        public static Action Debounce(this Action func, int milliseconds = 300)
        {
            var last = 0;
            return () =>
            {
                var current = Interlocked.Increment(ref last);
                Task.Delay(milliseconds).ContinueWith(task =>
                {
                    if (current == last) func();
                    task.Dispose();
                });
            };
        }

        public static Action<T1, T2> Debounce<T1, T2>(this Action<T1, T2> func, int milliseconds = 300)
        {
            var last = 0;
            return (arg1, arg2) =>
            {
                var current = Interlocked.Increment(ref last);
                Task.Delay(milliseconds).ContinueWith(task =>
                {
                    if (current == last) func(arg1, arg2);
                    task.Dispose();
                });
            };
        }

        public static EventHandler<T> Debounce<T>(this EventHandler<T> func, int milliseconds = 300)
        {
            var last = 0;
            return (arg1, arg2) =>
            {
                var current = Interlocked.Increment(ref last);
                Task.Delay(milliseconds).ContinueWith(task =>
                {
                    if (current == last) func(arg1, arg2);
                    task.Dispose();
                });
            };
        }
    }
}