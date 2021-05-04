using System.Collections;
using System.Collections.Generic;

namespace Plugin.AutoHunter.Utils
{
    public class LimitedSizeStack<T> : ICollection<T>
    {
        private readonly int maxSize;
        private readonly LinkedList<T> list;
        
        public LimitedSizeStack(int maxSize)
        {
            this.maxSize = maxSize;
            this.list = new LinkedList<T>();
        }

        public T Pop()
        {
            var item = this.list.First.Value;
            this.list.RemoveFirst();
            return item;
        }

        public void Add(T item)
        {
            Push(item);
        }

        public void Push(T item)
        {
            this.list.AddFirst(item);

            if(this.Count > this.maxSize)
                this.list.RemoveLast();
        }


        public IEnumerator<T> GetEnumerator()
        {
            return this.list.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return ((IEnumerable) this.list).GetEnumerator();
        }

        public void Clear()
        {
            this.list.Clear();
        }

        public bool Contains(T item)
        {
            return this.list.Contains(item);
        }

        public void CopyTo(T[] array, int arrayIndex)
        {
            this.list.CopyTo(array, arrayIndex);
        }

        public bool Remove(T item)
        {
            return this.list.Remove(item);
        }

        public int Count => this.list.Count;

        public bool IsReadOnly => false;
    }
}